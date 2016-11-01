'use strict';
const express = require('express');
const _ = require('lodash');

const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const auth = require('../../auth');

const logger=require('../../logger');

var router=express.Router();

router.post("/messages", auth.authApplication, (req, res) => {
  logger.info(req.body);
  logger.info("####APPMESSAGE");
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
  schema.Application.find({}).lean().exec()
  .then(applications=>{
    res.json(applications);
  });
});

router.post("/", (req, res) => {
  utils.registerApplication(req.body.name, req.body.description)
  .then(application=>{
    res.json(application);
  });
});

router.post('/:appId', (req, res) => {
  schema.Application.findByIdAndUpdate(req.params.appId, {
    name: req.body.name,
    description: req.body.description
  })
  .then(upd => {
    return res.json({
      status: 'ok'
    });
  });
});

router.delete("/:appId", (req, res) => {
  schema.Application.findByIdAndRemove(req.params.appId)
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