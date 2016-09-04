'use strict';
var express = require('express');
var _ = require('lodash');

var websockets = require('../../websockets');
var schema = require('../../schema');
var utils = require('../../utils');
var services = require('../../services');
var router=express.Router();

var applications = require('./applications');
var devices = require('./devices');
var readings = require('./readings');

router.get("/", (req, res) => {
  res.json({});
});

router.use("/devices", devices);
router.use("/readings", readings);
router.use("/applications", applications);

module.exports = router;