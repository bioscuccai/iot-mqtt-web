'use strict';
const express = require('express');
const _ = require('lodash');

const websockets = require('../../websockets');
const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const auth = require('../../auth');
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
    .lean()
    .exec();
  filter.device={
    $in: filteredDevices.map(device=>device._id.toString())
  }

  let total = yield schema.Reading.count(filter);
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
  res.json({
    total,
    readings
  });
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

router.post("/:readingId", (req, res) => {
  schema.Reading.findByIdAndUpdate(req.params.readingId, {
    data: req.body.data,
    type: req.body.type
  })
  .then(upd => {
    return res.json({
      status: 'ok'
    });
  })
  .catch(error => {
    return res.json({
      status: 'error',
      error
    });
  });
});

router.delete("/:readingId", (req, res) => {
  schema.Reading.findByIdAndRemove(req.params.readingId)
  .then(del => {
    return res.json({
      status: "ok"
    })
  })
  .catch(error => {
    return res.json({
      status: "error",
      error
    });
  });
});
module.exports = router;