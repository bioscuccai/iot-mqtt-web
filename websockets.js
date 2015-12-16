'use strict';
var utils = require('./utils');
var io=new require('socket.io')();

utils.readingWatcher.on("new_reading", data=>{
  console.log(data);
  console.log("######new event");
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