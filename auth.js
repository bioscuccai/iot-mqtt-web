var utils = require('./utils');
var crayon = require('crayon');

function authDevice(req, res, next){
  console.log(req.headers);
  if(!req.headers['x-iotfw-apptoken'] || !req.headers['x-iotfw-devicetoken']){
    res.json({status: 'error', message: 'unauthorized - no tokens'});
    return;
  }
  utils.validDevice(req.headers['x-iotfw-apptoken'], req.headers['x-iotfw-devicetoken'])
  .then(device=>{
    next();
  })
  .catch(err=>{
    crayon.error("Unathorized REST device");
    res.json({status: 'error', message: 'unauthorized'});
  });
}

function authApplication(req, res, next){
  console.log(req.headers);
  if(!req.headers['x-iotfw-apptoken'] || !req.headers['x-iotfw-appsecret']){
    res.json({status: 'error', message: 'unauthorized - no token'});
    return;
  }
  utils.validApplication(req.headers['x-iotfw-apptoken'], req.headers['x-iotfw-appsecret'])
  .then(device=>{
    next();
  })
  .catch(err=>{
    crayon.error("Unathorized REST app");
    res.json({status: 'error', message: 'unauthorized'});
  });
}

module.exports = {
  authDevice,
  authApplication
};