'use strict';
const schema = require('./schema');
const services = require('./services');
const bluebird = require('bluebird');
const securerandom = require('securerandom');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const crayon = require('crayon');
const _ = require('lodash');
const logger = require('./logger');

class ReadingWatcher{
  constructor(){
    EventEmitter.call(this);
  }
}
util.inherits(ReadingWatcher, EventEmitter);
var readingWatcher=new ReadingWatcher();

function registerDevice(name, type, applicationName){
  let app;
  return schema.Application.findOne({name: applicationName})
  .then(appDb => {
    if(appDb){
      schema.Device.create({
        name: name,
        type: type,
        token: securerandom.hex(16),
        application: appDb
      });
    }
  });
}

function registerApplication(name, description){
  console.log(`${name} / ${description}`);
  return schema.Application.create({
    name,
    description,
    token: securerandom.hex(16),
    secret: securerandom.hex(16)
  });
}

function storeReading(token, data, type, meta){
  return new Promise(function(resolve, reject) {
    let device;
    schema.Device.findOne({token}).populate("application").exec()
    .then(deviceDb=>{
      device=deviceDb;
      if(!device){
        throw(new Error("invalid token"));
      }
      console.log(data);
      return schema.Reading.create({
        device: device._id,
        application: device.application._id,
        data: data,
        type: type,
        loc: [_.get(meta, "loc[0]", 0), _.get(meta, "loc[1]", 0)]
      });
    })
    .then(reading=>{
      logger.info("stored reading");
      logger.info(reading);
      logger.info("device:");
      logger.info(device);
      readingWatcher.emit("new_reading", _.merge(reading, {appToken: device.application.token})); //pass app token too
      return resolve(reading);
    })
    .catch(e=>{
      logger.error(e);
      return reject(e);
    });
  });
}

function validApplication(username, password){
  return new Promise(function(resolve, reject) {
    schema.Application.findOne({
      token: username,
      secret: password.toString()
    })
    .then(appDb=>{
      if(appDb){
        logger.info(`App authenticated: ${appDb.name}`);
        return resolve({
          type: 'app',
          appToken: username,
          appName: appDb.name
        });
      } else {
        logger.error("App rejected");
        return reject({status: "invalid app"});
      }
    });
  });
}

function validDevice(username, password){
  return new Promise(function(resolve, reject) {
    schema.Application.findOne({token: username})
    .then(appDb=>{
      if(!appDb){
        logger.error("device/app rejected");
        return reject({status: "invalid app"});
      }
      return schema.Device.findOne({token: password});
    })
    .then(deviceDb=>{
      if(!deviceDb){
        logger.error("Device rejected");
        return reject({status: "invalid device"});
      }
      logger.info(`Device authenticated: ${deviceDb.name}`);
      return resolve({
        type: 'device',
        deviceToken: password,
        deviceName: deviceDb.name,
        deviceType: deviceDb.type,
        appToken: username
      });
    });
  });
}

function validTokenPair(username, password){
  return bluebird.any([
    validApplication(username, password),
    validDevice(username, password)
  ]);
}
function mqttAuthenticate(client, username, password, callback){
  if(!password || !username){
    logger.error("No login given");
    return callback({status: "login required"}, false);
  }
  validTokenPair(username, password.toString())
  .then(authData=>{
    client.user=authData;
    logger.info(`Authenticated ${client.user.appName || client.user.deviceName}`);
    callback(null, true);
  }).catch(authErr=>{
    logger.error(authErr);
    logger.error(`Rejected`);
    callback(authErr, false);
  });
}

function mqttAuthorizePublish(client, topic, payload, callback){
  if(client.user.type==="app"){
    return callback(null, true);
  }
  if(topic===`send_reading/${client.user.appToken}`){
    return callback(null, true);
  }
  logger.error(`Unauthorized publish to ${topic} from ${JSON.stringify(client.user, null, 2)}`);
  callback({status: "unauthorized"}, false);
  //callback(null, true);
}
function mqttAuthorizeSubscribe(client, topic, callback){
  //apps can subscribe to everything
  logger.info(`${JSON.stringify(client.user)} subscribing to ${topic}`);
  if(client.user.type==="app"){
    logger.info(`App ${client.user.appName} subscribed to ${topic}`);
    return callback(null, true);
  }
  if(topic===`appmessage/${client.user.appToken}/global`){
    logger.info(`Device ${client.user.deviceName} subscribed to broadcast`);
    return callback(null, true);
  }
  if(topic.startsWith(`appmessage/${client.user.appToken}/device_type/`)){
    let type=topic.replace(`appmessage/${client.user.appToken}/device_type/`, "");
    if(type===client.user.deviceType){
      logger.info(`Device ${client.user.deviceName} subscribed to type channel: ${type}`);
      return callback(null, true);
    } else {
      logger.error(`Device ${client.user.deviceName} rejected from type channel: ${type}`);
      return callback({status: "rejected type"}, false);
    }
  }
  if(topic.startsWith(`appmessage/${client.user.appToken}/device/`)){
    let deviceToken=topic.replace(`appmessage/${client.user.appToken}/device/`, "");
    if(deviceToken===client.user.deviceToken){
      logger.info(`Device ${client.user.deviceName} subscribed to private channel`);
      return callback(null, true);
    } else {
      logger.error(`Device ${client.user.deviceName} rejected from private channel`);
      return callback({status: "rejected private"}, false);
    }
  }
  logger.error("subscription rejected");
  callback(null, false);
}

services.moscaServer.on('ready', ()=>{
  logger.info("Mosca server ready");
  services.moscaServer.authenticate=mqttAuthenticate;
  services.moscaServer.authorizeSubscribe=mqttAuthorizeSubscribe;
  services.moscaServer.authorizePublish=mqttAuthorizePublish;
});

services.moscaServer.on("clientConnected", (client) => {
  logger.info("Mosca client connected");
});

function sendMessage(payload, appToken){
  logger.info("message");
  logger.info(payload);
  let deviceFilter={};
  //targeted device => each device gets notified on its own topic
  if(payload.targetDevice){
    logger.info("targeting device");
    if(payload.targetDevice){ //all devices with the given name
      deviceFilter=_.merge({}, deviceFilter, {name: payload.targetDevice});
    }
    if(payload.targetDeviceType){ //single device (both the name and type are given)
      deviceFilter=_.merge({}, deviceFilter, {type: payload.targetDeviceType});
    }
    schema.Device.find(deviceFilter).exec()
    .then(devices=>{
      devices.forEach(device=>{
        services.moscaServer.publish({
          topic: `appmessage/${appToken}/device/${device.token}`,
          payload: payload.message
        });
      });
    });
  //targeted device type => device type topic gets notified
  } else if(payload.targetDeviceType){
    logger.info("targeting device type");
    services.moscaServer.publish({
      topic: `appmessage/${appToken}/device_type/${payload.targetDeviceType}`,
      payload: payload.message
    });
  //broadcast
  } else{
    logger.info("broadcasting");
    logger.info(payload.message);
    services.moscaServer.publish({
      topic: `appmessage/${appToken}/global`,
      payload: payload.message
    });
  }
}

services.moscaServer.on("published", (packet, client) => {
  logger.info(packet);
  logger.info("topic: "+packet.topic);
  //console.log("payload: "+packet.payload.toString());
  
  //messages from the application to the devices
  if(packet.topic.startsWith("send_message/")){
    logger.info("NEW MESSAGE");
    let payload=JSON.parse(packet.payload.toString());
    sendMessage(payload, client.user.appToken);
  }
  
  if(packet.topic.startsWith("send_reading/")){
    try {
      let payload=JSON.parse(packet.payload.toString());
      logger.info("reading");
      logger.info(payload);
      storeReading(client.user.deviceToken, payload.data, payload.type, payload.meta);
    } catch(e){
      logger.error(`failed to parse payload: ${packet.payload.toString()}`);
    }
    
  }
});

readingWatcher.on("new_reading", reading=>{
  logger.info("publised app event");
  logger.info(reading);
  services.moscaServer.publish({
    topic: `appevent/${reading.appToken}`,
    payload: JSON.stringify(reading)
  });
});



module.exports = {
  storeReading,
  registerDevice,
  registerApplication,
  readingWatcher,
  sendMessage,
  validApplication,
  validDevice
};
