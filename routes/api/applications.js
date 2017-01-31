'use strict';
const express = require('express');
const _ = require('lodash');
const wrap = require('co-express');

const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const auth = require('../../auth');

const logger = require('../../logger');

var router = express.Router();

const Application = schema.Application;

router.post("/:appId/messages", auth.authApplication, (req, res) => {
  logger.info(req.body);
  logger.info("####APPMESSAGE");
  utils.sendMessage(req.body.payload, req.params.appId);
  res.json("ok");
});

router.get("/credentials", wrap(function* (req, res) {
  res.json({
    mqttPort: process.env.MQTT_PORT,
    mqttWsPort: process.env.MQTT_WS_PORT
  });
}));

router.get("/", wrap(function* (req, res) {
  let apps = yield Application.find().lean();

  res.json(apps.map(Application.toJSON));
}));

router.get('/:appId', wrap(function*(req, res) {
  let app = yield Application.findById({
    _id: req.params.appId
  });

  res.json(Application.toJSON(app));
}));

router.post("/", wrap(function* (req, res) {
  let app = yield utils.registerApplication(req.body.name, req.body.description);
  return res.json(Application.toJSON(app));
}));

router.post('/:appId', wrap(function* (req, res) {
  let app = yield Application.findByIdAndUpdate(req.params.appId, {
    name: req.body.name,
    description: req.body.description
  }, {
    new: true,
    lean: true
  });

  res.json(Application.toJSON(app));
}));

router.delete("/:appId", wrap(function* (req, res) {
  yield Application.findByIdAndRemove(req.params.appId);

  res.json({
    status: "ok"
  });
}));

module.exports = router;