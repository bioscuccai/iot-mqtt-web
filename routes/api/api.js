'use strict';
const express = require('express');
const _ = require('lodash');

const websockets = require('../../websockets');
const schema = require('../../schema');
const utils = require('../../utils');
const services = require('../../services');
const router=express.Router();

const applications = require('./applications');
const devices = require('./devices');
const readings = require('./readings');

router.get('/', (req, res) => {
  res.json({});
});


router.use('/applications", applications);
router.use('/applications/:appId/devices', devices);
router.use('/applications/:appId/readings', readings);

module.exports = router;
