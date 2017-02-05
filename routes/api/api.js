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

router.use('/applications', applications);
router.use('/devices', devices);
router.use('/readings', readings);

module.exports = router;
