'use strict';
var express = require('express');
var _ = require('lodash');

var schema = require('../../schema');
var utils = require('../../utils');
var services = require('../../services');
var auth = require('../../auth');
const logger = require('../../logger');
var router=express.Router();

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

module.exports = router;