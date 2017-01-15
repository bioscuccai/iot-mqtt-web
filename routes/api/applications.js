'use strict';
const express = require('express');
const _ = require('lodash');
const wrap = require('co-express');

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

router.get("/credentials", wrap(function* (req, res) {
  res.json({
    mqttPort: process.env.MQTT_PORT,
    mqttWsPort: process.env.MQTT_WS_PORT
  });
}));

router.get("/", wrap(function* (req, res) {
  let apps = yield schema.Application.find().lean();

  res.json(apps);
}));

router.post("/", wrap(function* (req, res) {
  let app = yield utils.registerApplication(req.body.name, req.body.description)
  res.json(app);
}));

router.post('/:appId', wrap(function* (req, res) {
  let app = yield schema.Application.findByIdAndUpdate(req.params.appId, {
    name: req.body.name,
    description: req.body.description
  }, {
    new: true,
    lean: true
  });

  res.json(app);
}));

router.delete("/:appId", wrap(function* (req, res) {
  yield schema.Application.findByIdAndRemove(req.params.appId);

  res.json({
    status: "ok"
  });
}));


module.exports = router;