'use strict';
const express = require('express');
const _ = require('lodash');
const securerandom = require('securerandom');

const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const auth = require('../../auth');
const logger = require('../../logger');
const router=express.Router();

router.get("/", auth.authApplication, (req, res) => {
  logger.info(req.headers);
  schema.Device.find({}).populate("application").exec()
  .then(devices => {
    res.json(devices.reverse());
  });
});

router.post("/", auth.authApplication, (req, res) => {
  logger.info(req.body);
  utils.registerDevice(req.body.name, req.body.type, req.body.applicationName)
  .then(dev=>{
    res.json({status: "ok"});
  })
  .catch(e=>{
    logger.error(e);
    res.json({status: "error", error: e});
  });
});

router.get("/:deviceId/regen_token", auth.authApplication, (req, res) => {
  schema.Device.findByIdAndUpdate(req.params.deviceId, {
    token: securerandom.hex(16)
  }, {
    new: true
  })
  .then((device) => {
    return device.populate({
      path: 'application',
      options: {
        lean: true
      }
    }).execPopulate();
  })
  .then(device => {
    res.json(device);
  })
  .catch(err=>{
    logger.error(err);
    res.json({
      status: 'error',
      error: err
    });
  })
});

router.post("/:deviceId", (req, res) => {
  schema.Device.findByIdAndUpdate(req.params.deviceId, {
    type: req.body.type,
    name: req.body.name
  })
  .then(upd => {
    res.json({
      status: 'ok'
    })
  })
  .catch(error => {
    res.json({
      status: "error",
      error
    })
  });
});

router.delete("/:deviceId", (req, res) => {
  schema.Device.findByIdAndRemove(req.params.deviceId)
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