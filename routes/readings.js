'use strict';
var express = require('express');
var utils = require('../utils');
var schema = require('../schema');

var router=express.Router();

router.get("/", (req, res) => {
  schema.Reading.find({}).exec()
  .then(readings=>{
    res.json(readings);
  });
});

router.post("/new", (req, res) => {
  console.log(req.body);
  utils.storeReading(req.body.token, JSON.parse(req.body.data), {})
  .then(reading => {
    res.json({status: 'ok'});
  })
  .catch(e=>{
    res.json(e);
    console.log(e);
  });
});

router.get("/new", (req, res) => {
  res.render("readings/new");
});

module.exports = router;
