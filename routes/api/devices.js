'use strict';
const express = require('express');
const _ = require('lodash');
const securerandom = require('securerandom');
const wrap = require('co-express');

const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const auth = require('../../auth');
const logger = require('../../logger');
const router=express.Router();

const Device = schema.Device;

let population = {
  path: 'application',
  options: {
    lean: true
  }
};

router.get("/", auth.authApplication, wrap(function* (req, res) {
  let devices = yield Device
    .find()
    .lean()
    .populate(population);
  res.json(devices.map(Device.toJSON));
}));

router.post("/", auth.authApplication, wrap(function* (req, res) {
  let device = yield Device.create({
    name: req.body.name,
    type: req.body.type,
    token: securerandom.hex(16),
    application: req.body.application
  });

  yield device.populate(population).execPopulate();

  res.json(Device.toJSON(device));
}));

router.post('/batchCreate', wrap(function* (req, res) {
  let devices = yield Device.create(_.map(req.body.devices, device => {
    return {
      name: device.name,
      type: device.type,
      token: securerandom.hex(16),
      application: device.application
    };
  }));

  res.json(devices);
}));

router.get('/:deviceId', wrap(function* (req, res) {
  let device = yield Device
    .findById(req.params.deviceId)
    .populate(population)
    .lean();
    
  if(!device) {
    return res.status(404);
  }
  
  return res.json(Device.toJSON(device));
}));

router.post("/:deviceId", wrap(function* (req, res) {
  let device = yield Device.findByIdAndUpdate(req.params.deviceId, {
    $set: {
      type: req.body.type,
      name: req.body.name,
      //application: req.body.application
    }
  }, {
    new: true
  });
  
  yield device.populate(population).execPopulate();

  res.json(Device.toJSON(device));
}));

router.delete("/:deviceId", wrap(function* (req, res) {
  yield Device.findByIdAndRemove(req.params.deviceId);
  return res.json({
    status: "ok"
  });
}));

router.post("/:deviceId/regenToken", auth.authApplication, wrap(function* (req, res) {
  let device = yield Device.findByIdAndUpdate(req.params.deviceId, {
    $set: {
      token: securerandom.hex(16)
    }
  }, {
    new: true
  });

  yield device.populate(population).execPopulate();

  res.json(Device.toJSON(device));
}));

module.exports = router;
