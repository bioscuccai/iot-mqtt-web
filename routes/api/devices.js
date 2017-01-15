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

router.get("/", auth.authApplication, wrap(function* (req, res) {
  let devices = yield schema.Device
    .find({})
    .lean()
    .populate({
      path: 'application',
      options: {
        lean: true
    }});
  res.json(devices.reverse());
}));

router.post("/", auth.authApplication, wrap(function* (req, res) {
  let device = utils.registerDevice(req.body.name, req.body.type, req.body.applicationName)
  res.json(device);
}));

router.get("/:deviceId/regen_token", auth.authApplication, wrap(function* (req, res) {
  let device = yield schema.Device.findByIdAndUpdate(req.params.deviceId, {
    token: securerandom.hex(16)
  }, {
    new: true
  });

  yield device.populate({
    path: 'application',
    options: {
      lean: true
    }
  }).execPopulate();

  res.json(device);
}));

router.post("/:deviceId", wrap(function* (req, res) {
  let device = schema.Device.findByIdAndUpdate(req.params.deviceId, {
    type: req.body.type,
    name: req.body.name
  }, {
    lean: true,
    new: true
  });

  res.json(device);
}));

router.delete("/:deviceId", wrap(function* (req, res) {
  yield schema.Device.findByIdAndRemove(req.params.deviceId);
  return res.json({
    status: "ok"
  });
}));

module.exports = router;