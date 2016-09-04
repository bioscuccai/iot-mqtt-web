'use strict';
var express = require('express');
var _ = require('lodash');

var websockets = require('../websockets');
var schema = require('../schema');
var utils = require('../utils');
var services = require('../services');
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

router.get("/readings", (req, res) => {
  let filter={};
  if (req.query.filterType) {
    filter={
      type: req.query.filterType
    };
  }
  schema.Reading.find(filter).populate("device", null, filter).exec()
  .then(readingsDb=>{
    let readings=readingsDb;
    if(req.query.filterDevice){
      //TODO
      readings=readings.filter(item=>{
        return _.get(item, "device.name")===req.query.filterDevice;
      });
    } else if (req.query.filterDeviceType){
      readings=readings.filter(item=>{
        return _.get(item, "device.type")===req.query.filterDeviceType;
      });
    }
    res.json(readings.reverse());
    /*res.json(readings.map(item=>{
      return _.merge({}, item, {createdAt: item._id.getTimestamp()});
    }));*/
  });
});

router.post("/readings/new", (req, res) => {
  console.log(req.body);
  utils.storeReading(req.body.token, JSON.parse(req.body.data), req.body.type, {})
  .then(reading => {
    res.json({status: 'ok'});
  })
  .catch(e=>{
    res.json(e);
    console.log(e);
  });
});

router.post("/messages", (req, res) => {
  console.log(req.body);
  utils.sendMessage(JSON.parse(req.body.payload));
  res.json("ok");
});

router.get("/credentials", (req, res) => {
  res.json({
    mqttPort: process.env.MQTT_PORT,
    mqttWsPort: process.env.MQTT_WS_PORT
  });
});

router.get("/applications", (req, res) => {
  schema.Application.find({})
  .then(applications=>{
    res.json(applications);
  });
});

router.post("/applications/new", (req, res) => {
  utils.registerApplication(req.body.name, req.body.description)
  .then(application=>{
    res.json(application);
  });
});
module.exports = router;