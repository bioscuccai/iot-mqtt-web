'use strict';
var dotenv = require('dotenv').load();
var express = require('express');
var mosca = require('mosca');
var http = require('http');
var formidable = require('formidable');
var serveStatic=require("serve-static");
var morgan = require('morgan');
var cors = require('cors');
var _ = require('lodash');
var crayon = require('crayon');

var websockets=require('./websockets');
var services=require('./services');
var schemas=require('./schema');
var utils = require('./utils');

var readings = require('./routes/readings');
var devices = require('./routes/devices');
var api = require('./routes/api');

crayon.verbose=true;
var app=express();
app.use(cors());
var http=require("http").Server(app);
websockets.setup(http);
app.set("view engine", "jade");
app.set("views", "./templates");
app.use((req, res, next)=>{
  let form=new formidable.IncomingForm();
  form.keepExtensions=true; //perserve the extensions
  form.parse(req, (err, fields, files)=>{
    req.body=fields;
    req.files=files;
  });
  form.on('end', ()=>{
    next();
  });
});
app.use(serveStatic(__dirname+"/static"));
app.use(morgan('dev', {
  skip: (req, res) => {
    return req.url.startsWith("/static");
  },
  immediate: true
}));


app.get("/", (req, res) => {
  res.redirect("/static");
});
app.use("/api", api);
app.use("/readings", readings);
app.use("/devices", devices);

app.get("/readings/new", (req, res) => {
  res.json({});
});

http.listen(parseInt(process.env.PORT));
