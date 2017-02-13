'use strict';
const schema = require('./schema');
const services = require('./services');
const bluebird = require('bluebird');
const securerandom = require('securerandom');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const crayon = require('crayon');
const _ = require('lodash');
const co = require('co');
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

const storeReading = co.wrap(function*(deviceId, data, type, meta){
  let device = yield schema.Device.findById(deviceId).populate('application');
  if (!device) {
    throw(new Error('invalid token'));
  }
  console.log(data);
  let reading = yield schema.Reading.create({
    device: device._id,
    application: device.application._id,
    data: data,
    type: type,
    loc: [_.get(meta, 'loc[0]', 0), _.get(meta, 'loc[1]', 0)]
  });
  logger.info('stored reading');
  logger.info(reading);
  logger.info('device:');
  logger.info(device);
  readingWatcher.emit('new_reading', _.merge(reading.toObject(), {appToken: device.application.token})); //pass app token too
  return reading;
});

const validApplication = co.wrap(function* (username, password){
  let appDb = yield schema.Application.findOne({
    _id: username,
    secret: password.toString()
  });
  if (appDb) {
    logger.info(`App authenticated: ${appDb.name}`);
    return {
      type: 'app',
      appToken: username,
      appName: appDb.name,
      appId: appDb._id.toString()
    };
  } else {
    logger.error('App rejected');
    throw new Error('invalid app');
  }
});

const validDevice = co.wrap(function* (username, password) {
  let deviceDb = yield schema.Device.findOne({
    _id: username,
    token: password.toString()
  });
  if(!deviceDb) {
    logger.error('Device rejected');
    throw new Error("invalid device");
  }
  logger.info(`Device authenticated: ${deviceDb.name}`);
  return {
    type: 'device',
    deviceId: deviceDb._id.toString(),
    deviceName: deviceDb.name,
    deviceType: deviceDb.type,
    appToken: username,
    appId: deviceDb.application.toString()
  };
});

function validTokenPair(username, password) {
  return bluebird.any([
    validApplication(username, password),
    validDevice(username, password)
  ]);
}

function mqttAuthenticate(client, username, password, callback) {
  if(!password || !username) {
    logger.error('No login given');
    return callback(new Error('login required'), false);
  }
  validTokenPair(username, password.toString())
  .then(authData => {
    client.user=authData;
    logger.info(`Authenticated ${client.user.appName || client.user.deviceName}`);
    callback(null, true);
  }).catch(authErr => {
    logger.error(authErr);
    logger.error('Rejected');
    callback(authErr, false);
  });
}

function mqttAuthorizePublish(client, topic, payload, callback) {
  if(client.user.type === 'app'){
    return callback(null, true);
  }
  console.log('checkin');
  console.log(`send_reading/${client.user.appId}`);
  if (topic === `send_reading/${client.user.appId}`) {
    return callback(null, true);
  }
  logger.error(`Unauthorized publish to ${topic} from ${JSON.stringify(client.user, null, 2)}`);
  callback(new Error('unauthorized'), false);
  //callback(null, true);
}
function mqttAuthorizeSubscribe(client, topic, callback) {
  console.log(JSON.stringify(client.user, null, 2));
  //apps can subscribe to everything
  logger.info(`${JSON.stringify(client.user)} subscribing to ${topic}`);
  if(client.user.type === 'app') {
    logger.info(`App ${client.user.appName} subscribed to ${topic}`);
    return callback(null, true);
  }
  if(topic === `appmessage/${client.user.appId}/global`) {
    logger.info(`Device ${client.user.deviceName} subscribed to broadcast`);
    return callback(null, true);
  }
  if(topic.startsWith(`appmessage/${client.user.appId}/device_type/`)) {
    let type = topic.replace(`appmessage/${client.user.appId}/device_type/`, "");
    if(type === client.user.deviceType) {
      logger.info(`Device ${client.user.deviceName} subscribed to type channel: ${type}`);
      return callback(null, true);
    } else {
      logger.error(`Device ${client.user.deviceName} rejected from type channel: ${type}`);
      return callback(new Error('rejected type'), false);
    }
  }
  if(topic.startsWith(`appmessage/${client.user.appId}/device/`)) {
    let deviceId = topic.replace(`appmessage/${client.user.appId}/device/`, "");
    if(deviceId === client.user.deviceId) {
      logger.info(`Device ${client.user.deviceName} subscribed to private channel`);
      return callback(null, true);
    } else {
      logger.error(`Device ${client.user.deviceName} rejected from private channel`);
      return callback(new Error('rejected private'), false);
    }
  }
  logger.error('subscription rejected');
  callback(null, false);
}

services.moscaServer.on('ready', () => {
  logger.info('Mosca server ready');
  services.moscaServer.authenticate = mqttAuthenticate;
  services.moscaServer.authorizeSubscribe = mqttAuthorizeSubscribe;
  services.moscaServer.authorizePublish = mqttAuthorizePublish;
});

services.moscaServer.on('clientConnected', client => {
  logger.info('Mosca client connected');
});

function sendMessage(payload, appToken) {
  logger.info('message');
  logger.info(payload);
  let deviceFilter = {};
  //targeted device => each device gets notified on its own topic
  if (payload.targetDevice) {
    logger.info('targeting device');
    if (payload.targetDevice) { //all devices with the given name
      deviceFilter = _.merge({}, deviceFilter, {name: payload.targetDevice});
    }
    if(payload.targetDeviceType) { //single device (both the name and type are given)
      deviceFilter = _.merge({}, deviceFilter, {type: payload.targetDeviceType});
    }
    schema.Device.find(deviceFilter).exec()
    .then(devices => {
      devices.forEach(device => {
        services.moscaServer.publish({
          topic: `appmessage/${appToken}/device/${device.token}`,
          payload: payload.message
        });
      });
    });
  //targeted device type => device type topic gets notified
  } else if(payload.targetDeviceType) {
    logger.info('targeting device type');
    services.moscaServer.publish({
      topic: `appmessage/${appToken}/device_type/${payload.targetDeviceType}`,
      payload: payload.message
    });
  //broadcast
  } else{
    logger.info('broadcasting');
    logger.info(payload.message);
    services.moscaServer.publish({
      topic: `appmessage/${appToken}/global`,
      payload: payload.message
    });
  }
}

services.moscaServer.on('published', (packet, client) => {
  logger.info(packet);
  logger.info('topic: '+packet.topic);
  //console.log("payload: "+packet.payload.toString());
  
  //messages from the application to the devices
  if(packet.topic.startsWith('send_message/')) {
    logger.info('NEW MESSAGE');
    let payload=JSON.parse(packet.payload.toString());
    sendMessage(payload, client.user.appToken);
  }
  
  if(packet.topic.startsWith('send_reading/')) {
    try {
      let payload=JSON.parse(packet.payload.toString());
      logger.info('reading');
      logger.info(payload);
      storeReading(client.user.deviceId, payload.data, payload.type, payload.meta);
    } catch(e){
      logger.error(`failed to parse payload: ${packet.payload.toString()}`);
    }
  }
});

readingWatcher.on('new_reading', reading => {
  logger.info('publised app event');
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
