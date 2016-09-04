'use strict';
var express = require('express');
var _ = require('lodash');

var schema = require('../../schema');
var utils = require('../../utils');
var services = require('../../services');
var auth = require('../../auth');

var router=express.Router();

router.post("/messages", auth.authApplication, (req, res) => {
  console.log(req.body);
  console.log("####APPMESSAGE");
  utils.sendMessage(JSON.parse(req.body.payload), req.headers['x-iotfw-apptoken']);
  res.json("ok");
});

router.get("/credentials", (req, res) => {
  res.json({
    mqttPort: process.env.MQTT_PORT,
    mqttWsPort: process.env.MQTT_WS_PORT
  });
});

router.get("/", (req, res) => {
  schema.Application.find({})
  .then(applications=>{
    res.json(applications);
  });
});

router.post("/new", (req, res) => {
  utils.registerApplication(req.body.name, req.body.description)
  .then(application=>{
    res.json(application);
  });
});
module.exports = router;