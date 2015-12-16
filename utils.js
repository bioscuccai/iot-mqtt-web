'use strict';
var schema = require('./schema');
var services = require('./services');
var bluebird = require('bluebird');
var securerandom = require('securerandom');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var crayon = require('crayon');
var _ = require('lodash');
var bluebird = require('bluebird');

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
    schema.Device.create({
      name: name,
      type: type,
      token: securerandom.hex(16),
      application: appDb
    });
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
    schema.Device.findOne({token}).exec()
    .then(deviceDb=>{
      device=deviceDb;
      if(!device){
        throw("invalid token");
      }
      console.log(data);
      return schema.Reading.create({
        device: device._id,
        data: data,
        type: type,
        loc: [0,0]
      });
    })
    .then(reading=>{
      console.log(reading);
      readingWatcher.emit("new_reading", reading);
      return resolve("reading");
    })
    .catch(e=>{
      console.log(e);
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
        crayon.info(`App authenticated: ${appDb.name}`);
        return resolve({
          type: 'app',
          appToken: username,
          appName: appDb.name
        });
      } else {
        crayon.error("App rejected");
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
        crayon.error("device/app rejected");
        return reject({status: "invalid app"});
      }
      return schema.Device.findOne({token: password});
    })
    .then(deviceDb=>{
      if(!deviceDb){
        crayon.error("device rejected");
        return reject({status: "invalid device"});
      }
      crayon.info(`Device authenticated: ${deviceDb.name}`);
      return resolve({
        type: 'device',
        deviceToken: password,
        deviceName: deviceDb.name,
        deviceType: deviceDb.type
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
  validTokenPair(username, password.toString())
  .then(authData=>{
    client.user=authData;
    crayon.info(`Authenticated ${client.user.appName || client.user.deviceName}`);
    callback(null, true);
  }).catch(authErr=>{
    console.log(authErr);
    crayon.error(`Rejected`);
    callback(authErr, false);
  });
}
/*
function mqttAuthenticate(client, username, password, callback){
  console.log(username);
  console.log(password.toString());
  schema.Application.findOne({
    token: username,
    secret: password.toString()
  })
  .then(app=>{
    crayon.info("AUTH");
    console.log(app);
    if(app){
      client.user={
        type: 'app',
        apptoken: username
      };
      crayon.info(("APP authenthicated"));
      return callback(null, true);
    }
    schema.Application.findOne({token: username})
    .then(app=>{
      if(!app){
        crayon.error("no app found");
        return callback("no app", false);
      }
      schema.Device.findOne({
        token: password.toString(),
        application: app
      })
      .then(dev=>{
        if(!dev){
          crayon.error("DEVICE not found");
          return callback("no dev", false);
        }
        client.user={
          type: 'device',
          devicetoken: username
        };
        crayon.info("DEVICE found");
        return callback(null, true);
      });
    });
  });
}
*/
function mqttAuthorizePublish(client, topic, payload, callback){
  if(client.user.type==="app"){
    return callback(null, true);
  }
  if(topic==="send_reading"){
    return callback(null, true);
  }
  callback({status: "unauthorized"}, false);
  //callback(null, true);
}
function mqttAuthorizeSubscribe(client, topic, callback){
  //apps can subscribe to everything
  crayon.info(`${JSON.stringify(client.user)} subscribing to ${topic}`);
  if(client.user.type==="app"){
    crayon.info(`App ${client.user.appName} subscribed to ${topic}`);
    return callback(null, true);
  }
  if(topic==="appmessage/global"){
    crayon.info(`Device ${client.user.deviceName} subscribed to broadcast`);
    return callback(null, true);
  }
  if(topic.startsWith("appmessage/device_type/")){
    let type=topic.replace("appmessage/device_type/", "");
    if(type===client.user.deviceType){
      crayon.info(`Device ${client.user.deviceName} subscribed to type channel: ${type}`);
      return callback(null, true);
    } else {
      crayon.error(`Device ${client.user.deviceName} rejected from type channel: ${type}`);
      return callback({status: "rejected type"}, false);
    }
  }
  if(topic.startsWith("appmessage/device/")){
    let deviceToken=topic.replace("appmessage/device/", "");
    if(deviceToken===client.user.deviceToken){
      crayon.info(`Device ${client.user.deviceName} subscribed to private channel`);
      return callback(null, true);
    } else {
      crayon.error(`Device ${client.user.deviceName} rejected from private channel`);
      return callback({status: "rejected private"}, false);
    }
  }
  crayon.error("subscription rejected");
  callback(null, false);
}

services.moscaServer.on('ready', ()=>{
  console.log("ready");
  services.moscaServer.authenticate=mqttAuthenticate;
  services.moscaServer.authorizeSubscribe=mqttAuthorizeSubscribe;
  services.moscaServer.authorizePublish=mqttAuthorizePublish;
});

services.moscaServer.on("clientConnected", (client) => {
  //console.log(client);
  console.log("connected");
});

function sendMessage(payload){
  crayon.info("message");
  console.log(payload);
  let deviceFilter={};
  //targeted device => each device gets notified on its own topic
  if(payload.targetDevice){
    crayon.info("targeting device");
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
          topic: `appmessage/device/${device.token}`,
          payload: payload.message
        });
      });
    });
  //targeted device type => device type topic gets notified
  } else if(payload.targetDeviceType){
    crayon.info("targeting device type");
    services.moscaServer.publish({
      topic: `appmessage/device_type/${payload.targetDeviceType}`,
      payload: payload.message
    });
  //broadcast
  } else{
    crayon.info("broadcasting");
    console.log(payload.message);
    services.moscaServer.publish({
      topic: 'appmessage/global',
      payload: payload.message
    });
  }
}

services.moscaServer.on("published", (packet, client) => {
  console.log(packet);
  console.log("topic: "+packet.topic);
  //console.log("payload: "+packet.payload.toString());
  
  //messages from the application to the devices
  if(packet.topic==="send_message"){
    let payload=JSON.parse(packet.payload.toString());
    sendMessage(payload);
  }
  
  if(packet.topic==="send_reading"){
    let payload=JSON.parse(packet.payload.toString());
    crayon.info("reading");
    console.log(payload);
    storeReading(payload.token, payload.data, payload.type, {});
  }
});

readingWatcher.on("new_reading", reading=>{
  services.moscaServer.publish({
    topic: 'appevent',
    payload: JSON.stringify(reading)
  });
});



module.exports = {
  storeReading,
  registerDevice,
  registerApplication,
  readingWatcher,
  sendMessage
};
