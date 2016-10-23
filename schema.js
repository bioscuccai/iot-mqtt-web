'use strict';
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('./logger');
mongoose.set('debug', true);
mongoose.Promise=bluebird;
mongoose.connect(process.env.MONGO_ENV_URI || process.env.MONGO_URI || "mongodb://localhost:27017/test");

var applicationSchema=mongoose.Schema({
  name: {type: String, index: {unique: true}, required: true},
  description: String,
  token: String,
  secret: String
}, {timestamps: true});


var deviceSchema=mongoose.Schema({
  name: {type: String, index: 1, required: true},
  type: {type: String},
  token: String,
  application: {type: mongoose.Schema.Types.ObjectId, index: 1, ref: 'Application'}
}, {timestamps: true});
deviceSchema.index({name: 1, type: 1}, {unique: true});

var deviceType=mongoose.Schema({
  name: String,
  readings: {type: [mongoose.Schema.Types.ObjectId]}
});

var readingSchema=mongoose.Schema({
  data: {type: mongoose.Schema.Types.Mixed, required: true},
  type: String,
  device: {type: mongoose.Schema.Types.ObjectId, index: 1, ref: "Device"},
  loc: [Number]
}, {timestamps: true});
readingSchema.index({loc: "2dsphere"});


var Application=mongoose.model("Application", applicationSchema);
var Device=mongoose.model("Device", deviceSchema);
var Reading=mongoose.model("Reading", readingSchema);

module.exports = {
  Device,
  Reading,
  Application
};
