'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('./logger');
mongoose.set('debug', true);
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGO_ENV_URI || process.env.MONGO_URI || "mongodb://localhost:27017/test");

var applicationSchema = mongoose.Schema({
  name: {type: String, index: {unique: true}, required: true},
  description: String,
  token: String,
  secret: String
}, {timestamps: true});

applicationSchema.statics.toJSON = function (application) {
  if (!application) {
    return null;
  }
  return {
    id: application._id.toString(),
    name: application.name || '',
    descriptions: application.description || '',
    token: application.token || '',
    secret: application.secret || ''
  };
};

var deviceSchema = mongoose.Schema({
  name: {type: String, index: 1, required: true},
  type: {type: String},
  token: String,
  application: {type: mongoose.Schema.Types.ObjectId, index: 1, ref: 'Application', required: true}
}, {timestamps: true});
//deviceSchema.index({name: 1, type: 1}, {unique: true});
//deviceSchema.index({token: 1}, {unique: true});
//deviceSchema.index({application: 1});

deviceSchema.statics.toJSON = function (device) {
  if (!device) {
    return null;
  }
  return {
    id: device._id.toString(),
    name: device.name || '',
    type: device.type || '',
    application: applicationSchema.statics.toJSON(device.application),
    token: device.token
  };
};

var deviceType = mongoose.Schema({
  name: String,
  readings: {type: [mongoose.Schema.Types.ObjectId]}
});

var readingSchema = mongoose.Schema({
  data: {type: mongoose.Schema.Types.Mixed, required: true},
  type: String,
  device: {type: mongoose.Schema.Types.ObjectId, index: 1, ref: 'Device'},
  loc: [Number],
  meta: {type: mongoose.Schema.Types.Mixed}
}, {timestamps: true});
readingSchema.index({loc: '2dsphere'});

readingSchema.statics.toJSON = function (reading) {
  return {
    id: reading._id.toString(),
    device: deviceSchema.statics.toJSON(reading.device),
    loc: reading.loc,
    data: reading.data,
    meta: reading.meta,
    createdAt: reading.createdAt,
    updatedAt: reading.updatedAt
  };
};

readingSchema.statics.toJSON = function (reading) {
  if (!reading) {
    return null;
  }

  return {
    id: reading._id.toString(),
    data: reading.data,
    meta: reading.meta,
    loc: reading.loc
  };
};

var Application = mongoose.model('Application', applicationSchema);
var Device = mongoose.model('Device', deviceSchema);
var Reading = mongoose.model('Reading', readingSchema);

module.exports = {
  Device,
  Reading,
  Application
};
