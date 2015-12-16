'use strict';
var express = require('express');
var _ = require('lodash');

var schema = require('../../schema');
var utils = require('../../utils');
var services = require('../../services');
var router=express.Router();

router.get("/devices", (req, res) => {
  schema.Device.find({}).populate("application").exec()
  .then(devices => {
    res.json(devices.reverse());
    /*
    res.json(devices.map(item=>{
      return _.merge({}, item, {createdAt: item._id.getTimestamp()});
    }));*/
  });
});

router.post("/devices/new", (req, res) => {
  console.log(req.body);
  utils.registerDevice(req.body.name, req.body.type, req.body.applicationName)
  .then(dev=>{
    res.json({status: "ok"});
  })
  .catch(e=>{
    res.json({status: "error", error: e});
    console.log(e);
  });
});

module.exports = router;