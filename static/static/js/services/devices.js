app.factory("DeviceFactory", function($http, $q, GlobalSettings){
  function devices(){
    var def=$q.defer();
    $http.get("http://"+window.location.host+"/api/devices",{
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.selectedApp.token,
        'X-IOTFW-AppSecret': GlobalSettings.selectedApp.secret
      }
    })
    .then(function(response){
      return def.resolve(response.data);
    })
    .catch(function(err){
      return def.reject(err);
    });
    return def.promise;
  }
  
  function newDevice(device){
    var def=$q.defer();
    $http.post("http://"+window.location.host+"/api/devices", {
      name: device.name,
      type: device.type,
      applicationName: _.get(device, "application.name")
    }, {
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.selectedApp.token,
        'X-IOTFW-AppSecret': GlobalSettings.selectedApp.secret
      }})
    .then(function(response){
      return def.resolve(response.data);
    }).catch(function (err) {
      return def.reject(err);
    });
    return def.promise;
  }

  function regenToken(deviceId){
    return $http.get("http://"+window.location.host+"/api/devices/"+deviceId+"/regen_token", {
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.selectedApp.token,
        'X-IOTFW-AppSecret': GlobalSettings.selectedApp.secret
      }
    })
  }

  function saveDevice(device) {
    return $http.post("http://"+window.location.host+"/api/devices/"+device._id, {
      name: device.name,
      type: device.type
    }, {
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.selectedApp.token,
        'X-IOTFW-AppSecret': GlobalSettings.selectedApp.secret
      }
    });
  }

  function deleteDevice(device) {
    return $http.post("http://" + window.location.host + "/api/devices/" + device._id + "?_method=DELETE");
  }

  return {
    devices: devices,
    newDevice: newDevice,
    regenToken: regenToken,
    saveDevice,
    deleteDevice
  };
});
