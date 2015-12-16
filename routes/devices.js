'use strict';
var express = require('express');

var schema = require('../schema');
var utils = require('../utils');
var router=express.Router();

router.get("/", (req, res) => {
  schema.Device.find({}).exec()
  .then(devices => {
    res.json(devices);
  });
});

router.get('/new', (req, res) => {
  res.render("devices/new");
});

router.post("/new", (req, res) => {
  utils.registerDevice(req.body.name, req.body.type)
  .then(dev=>{
    res.json({status: "ok"});
  })
  .catch(e=>{
    res.json({status: "error", error: e});
    console.log(e);
  });
});

module.exports = router;
