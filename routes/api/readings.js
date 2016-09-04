'use strict';
var express = require('express');
var _ = require('lodash');

var websockets = require('../../websockets');
var schema = require('../../schema');
var utils = require('../../utils');
var services = require('../../services');
var auth = require('../../auth');

var router=express.Router();

router.get("/", auth.authApplication, (req, res) => {
  let filter={};
  if (req.query.filterType) {
    filter={
      type: req.query.filterType
    };
  }
  schema.Reading.find(filter).sort({createdAt: -1}).populate("device", null, filter).exec()
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

router.post("/new", auth.authDevice, (req, res) => {
  utils.storeReading(req.headers['x-iotfw-devicetoken'], JSON.parse(req.body.data), req.body.type, {})
  .then(reading => {
    res.json({status: 'ok'});
  })
  .catch(e=>{
    res.json(e);
    console.log(e);
  });
});

module.exports = router;