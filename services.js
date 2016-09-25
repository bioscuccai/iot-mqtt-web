'use strict';
const mongodb = require('mongodb');
const assert = require('assert');
const mosca = require('mosca');
const _ = require('lodash');
const schemas = require('./schema');
const utils = require('./utils');
/*
var MongoClient=mongodb.MongoClient;

var dbMongo;

MongoClient.connect("mongodb://localhost:27017/test", (err, db) => {
  assert.equal(null, err);
  dbMongo=db;
  console.log(err);
});
*/


var pubsubsettings = {
  //using ascoltatore
  //type: 'mongo',        
  //url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaServer = new mosca.Server({
  port: parseInt(process.env.MQTT_PORT),
  http: {
    port: parseInt(process.env.MQTT_WS_PORT),
    bundle: true,
    static: './'
  }
//  backend: pubsubsettings
});

module.exports = {
  //dbMongo,
  moscaServer
};
