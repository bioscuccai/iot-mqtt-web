'use strict';
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var crayon = require('crayon');
mongoose.set('debug', true);
mongoose.Promise=bluebird;
mongoose.connect(process.env.MONGO_ENV_URI || process.env.MONGO_URI || "mongodb://localhost:27017/test");

var applicationSchema=mongoose.Schema({
  name: {type: String, index: {unique: true}, required: true},
  description: String,
  token: String,
  secret: String
}, {timestamps: true});


var deviceSchema=mongoose.Schema({
  name: {type: String, index: 1, required: true},
  type: {type: String},
  token: String,
  application: {type: mongoose.Schema.Types.ObjectId, index: 1, ref: 'Application'}
}, {timestamps: true});
deviceSchema.index({name: 1, type: 1}, {unique: true});

var deviceType=mongoose.Schema({
  name: String,
  readings: {type: [mongoose.Schema.Types.ObjectId]}
});

var readingSchema=mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
  type: String,
  device: {type: mongoose.Schema.Types.ObjectId, index: 1, ref: "Device"},
  loc: [Number]
}, {timestamps: true});
readingSchema.index({loc: "2d"});


var Application=mongoose.model("Application", applicationSchema);
var Device=mongoose.model("Device", deviceSchema);
var Reading=mongoose.model("Reading", readingSchema);

function defaultApp(){
  return new Promise(function(resolve, reject) {
    console.log("starting default app");
    Application.findOne({token: 'demo', secret: 'demo'}).exec()
    .then(appDb=>{
      if(!appDb){
        Application.create({
          name: 'demo',
          token: 'demo',
          secret: 'demo',
          description: 'demo'
        })
        .then(a=>{
          crayon.info("demo app created");
          return resolve(a);
        })
        .catch(e=>{
          crayon.error(e);
          return reject(e);
        });
      } else {
        return resolve(appDb);
      }
    });
  });
}

mongoose.connection.on("connected", (ev)=>{
  defaultApp()
  .then(defApp=>{
    console.log("default app");
    console.log(defApp);
    Device.findOne({token: 'demo_device_token'}).exec()
    .then(deviceDb=>{
      if(!deviceDb){
        Device.create({
          name: 'demo_device',
          token: 'demo_device_token',
          type: 'demo_device_type',
          application: defApp
        })
        .then(dev=>{
          crayon.info("demo device created");
        })
        .catch(err=>{
          crayon.error(err);
        });
      }
    });
  })
  .catch(err=>{
    console.log(err);
  });
});

module.exports = {
  Device,
  Reading,
  Application
};
