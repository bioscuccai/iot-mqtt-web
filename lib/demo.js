'use strict';

const schema = require('../schema');
const logger = require('../logger');

function demoApp(){
  return new Promise(function(resolve, reject) {
    logger.info("starting default app");
    schema.Application.findOne({token: 'demo', secret: 'demo'}).exec()
    .then(appDb=>{
      if(!appDb){
        schema.Application.create({
          name: 'demo',
          token: 'demo',
          secret: 'demo',
          description: 'demo'
        })
        .then(a=>{
          logger.info("demo app created");
          return resolve(a);
        })
        .catch(e=>{
          logger.error(e);
          return reject(e);
        });
      } else {
        return resolve(appDb);
      }
    });
  });
}

function demoDevice () {
  defaultApp()
  .then(defApp=>{
    logger.info("Default app has been created");
    logger.info(defApp);
    schema.Device.findOne({token: 'demo_device_token'}).exec()
    .then(deviceDb=>{
      if(!deviceDb){
        schema.Device.create({
          name: 'demo_device',
          token: 'demo_device_token',
          type: 'demo_device_type',
          application: defApp
        })
        .then(dev=>{
          logger.info("demo device created");
        })
        .catch(err=>{
          logger.warn("No demo device created");
          logger.warn(err);
        });
      }
    });
  })
  .catch(err=>{
    logger.warn("No demo app created");
    logger.warn(err);
  })
}

module.exports = {
  demoApp,
  demoDevice
}