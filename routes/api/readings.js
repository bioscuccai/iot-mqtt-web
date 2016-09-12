'use strict';
var express = require('express');
var _ = require('lodash');

var websockets = require('../../websockets');
var schema = require('../../schema');
var utils = require('../../utils');
var services = require('../../services');
var auth = require('../../auth');
const wrap=require('co-express');
const logger = require('../../logger');


var router=express.Router();

router.get("/", auth.authApplication, wrap(function*(req, res) {
  let limit = Math.max(0, parseInt(req.query.limit)) || 0;
  let skip = Math.max(0, parseInt(req.query.skip)) || 0;  
  let application = yield schema.Application
    .findOne({
      token: req.headers['x-iotfw-apptoken']
    })
    .select('')
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


  let filteredDevices = yield schema.Device.find(deviceFilter)
    .select("")
    .lean()
    .exec();
  filter.device={
    $in: filteredDevices.map(device=>device._id.toString())
  }

  let readings=yield schema.Reading.find(filter).sort({createdAt: -1})
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
    res.json(readings);
  })
);

router.post("/", auth.authDevice, (req, res) => {
  utils.storeReading(req.headers['x-iotfw-devicetoken'], JSON.parse(req.body.data), req.body.type, req.body.meta)
  .then(reading => {
    res.json({status: 'ok'});
  })
  .catch(e=>{
    logger.error(e);
    res.json(e);
  });
});

module.exports = router;