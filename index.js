'use strict';
const dotenv = require('dotenv').load();
const express = require('express');
const mosca = require('mosca');
const formidable = require('formidable');
const serveStatic=require("serve-static");
const morgan = require('morgan');
const cors = require('cors');
const _ = require('lodash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const websockets=require('./websockets');
const services=require('./services');
const schemas=require('./schema');
const utils = require('./utils');
const demo = require('./lib/demo');

const api = require('./routes/api/api');

var app=express();
app.use(cors());
const http=require("http").Server(app);
app.use(methodOverride('_method'));
websockets.setup(http);
app.set("view engine", "jade");
app.set("views", "./templates");
app.disable('view cache');
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

mongoose.connection.on('connected', demo.demoApp);

http.listen(parseInt(process.env.PORT || process.env.HTTP_PORT || 3000));
