'use strict';
var utils = require('./utils');
var io=new require('socket.io')();
const logger = require('./logger');
io.set("origins", "*:*");

utils.readingWatcher.on("new_reading", data=>{
  logger.info(data);
  logger.info("######WS new event");
  io.sockets.emit("new_reading", data);
});
function setup(http){
  io.attach(http);
  io.on("connect", socket=>{
    
  });
  console.log("setup");
  return io;
}
module.exports ={
  setup,
  io
};
