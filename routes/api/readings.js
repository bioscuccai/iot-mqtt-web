'use strict';

const express = require('express');
const _ = require('lodash');
const wrap = require('co-express');

const websockets = require('../../websockets');
const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const auth = require('../../auth');
const logger = require('../../logger');


var router = express.Router();

const Reading = schema.Reading;
const Device = schema.Device;
const Application = schema.Application;

router.get("/", auth.authApplication, wrap(function*(req, res) {
  let limit = Math.max(0, parseInt(req.query.limit)) || 100;
  let skip = Math.max(0, parseInt(req.query.skip)) || 0;  
  let application = yield Application
    .findOne({
      //token: req.headers['x-iotfw-apptoken']
    })
    .select('')
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
  let filter={};

  let deviceFilter = {
    application: application._id
  };

  if(req.query.filterDeviceName){
    deviceFilter.deviceName=req.query.filterDeviceName;
  }
  if(req.query.filterDeviceType){
    deviceFilter.deviceType=req.query.filterDeviceType;
  }


  let filteredDevices = yield Device.find(deviceFilter)
    .lean()
    .exec();
  if (req.query.filterApplication) {
    filter.device={
      $in: filteredDevices.map(device=>device._id.toString())
    };
  }

  let count = yield schema.Reading.count(filter);
  let readings=yield Reading.find().sort({createdAt: -1})
    .populate({
      path: 'device',
      options: {
        lean: 1
      }
    })
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean()
    .exec();
  res.json({
    count,
    readings: readings.map(Reading.toJSON)
  });
  })
);

router.post("/", auth.authDevice, wrap(function*(req, res) {
  let reading = yield utils.storeReading(req.headers['x-iotfw-devicetoken'], JSON.parse(req.body.data), req.body.type, req.body.meta);
  res.json(reading);
}));

router.post("/:readingId", wrap(function* (req, res) {
  let reading = Reading.findByIdAndUpdate(req.params.readingId, {
    data: req.body.data,
    type: req.body.type
  }, {
    new: true,
    lean: true
  });

  res.json(Readings.toJSON(reading));
}));

router.get('/:readingId', wrap(function* (req, res) {
  let reading = Reading
    .findOneById(req.params.readingId)
    .lean();
  
  if (!reading) {
    return res.status(404);
  }
  
  return res.json(Reading.toJSON(reading));
}));

router.delete("/:readingId", wrap(function* (req, res) {
  yield Reading.findByIdAndRemove(req.params.readingId);
  res.json({
    status: "ok"
  });
}));

module.exports = router;
