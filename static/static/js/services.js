app.factory('WsFactory', function(socketFactory){
  var ioSocket = io.connect('ws://localhost:5000');
  return socketFactory({ioSocket: ioSocket});
});

app.factory('DashboardFactory', function($http, $q){
  function credentials(){
    var def=$q.defer();
    var creds={};
    $http.get("http://"+window.location.host+"/api/applications/credentials")
    .then(function(response){
      creds=_.merge({}, response.data);
    })
    .finally(function(){
      def.resolve(creds);
    });
    return def.promise;
  }
  return {
    credentials: credentials
  };
});
/*
██████  ███████ ██    ██ ██  ██████ ███████ ███████ 
██   ██ ██      ██    ██ ██ ██      ██      ██      
██   ██ █████   ██    ██ ██ ██      █████   ███████ 
██   ██ ██       ██  ██  ██ ██      ██           ██ 
██████  ███████   ████   ██  ██████ ███████ ███████ 
*/
app.factory("DeviceFactory", function($http, $q, GlobalSettings){
  function devices(){
    var def=$q.defer();
    $http.get("http://"+window.location.host+"/api/devices",{
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.app.appToken,
        'X-IOTFW-AppSecret': GlobalSettings.app.appSecret
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
  
  function newDevice(name, type, applicationName){
    var def=$q.defer();
    console.log("new device app: "+applicationName);
    $http.post("http://"+window.location.host+"/api/devices", {
      name: name,
      type: type,
      applicationName: applicationName
    }, {
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.app.appToken,
        'X-IOTFW-AppSecret': GlobalSettings.app.appSecret
      }})
    .then(function(response){
      return def.resolve(response.data);
    }).catch(function (err) {
      return def.reject(err);
    });
    return def.promise;
  }
  
  function regenToken(oldToken){
    var def=$q.defer();
    $http.post("http://"+window.location.host+"/api/devices/regen_token", {
      oldToken: oldToken
    })
    .then(function (response) {
      return def.resolve(response.data);
    })
    .catch(function (err) {
      return def.reject(err);
    });
    return def.promise;
  }
  
  return {
    devices: devices,
    newDevice: newDevice,
    regenToken: regenToken
  };
});
/*
██████  ███████  █████  ██████  ██ ███    ██  ██████  ███████ 
██   ██ ██      ██   ██ ██   ██ ██ ████   ██ ██       ██      
██████  █████   ███████ ██   ██ ██ ██ ██  ██ ██   ███ ███████ 
██   ██ ██      ██   ██ ██   ██ ██ ██  ██ ██ ██    ██      ██ 
██   ██ ███████ ██   ██ ██████  ██ ██   ████  ██████  ███████ 
*/
app.factory("ReadingFactory", function($http, $q, GlobalSettings){
  function readings(query_){
    var query=query_||{};
    var def=$q.defer();
    $http.get("http://"+window.location.host+"/api/readings", {
      params: {
        filterDevice: query.deviceName,
        filterDeviceType: query.deviceType,
        filterType: query.type
      }, headers: {
        'X-IOTFW-AppToken': GlobalSettings.app.appToken,
        'X-IOTFW-AppSecret': GlobalSettings.app.appSecret
      }
    })
    .then(function(response){
      return def.resolve(response.data);
    });
    return def.promise;
  }
  
  function newReading(token, data, type, meta){
    return $http.post("http://"+window.location.host+"/api/readings", {
      token: token,
      data: data,
      type: type,
      meta: meta
    }, {
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.app.appToken,
        'x-iotfw-devicetoken': token
      }
    });
  }
  
  return {
    readings: readings,
    newReading: newReading
  };
});
/*
███    ███ ███████ ███████ ███████  █████   ██████  ███████ ███████ 
████  ████ ██      ██      ██      ██   ██ ██       ██      ██      
██ ████ ██ █████   ███████ ███████ ███████ ██   ███ █████   ███████ 
██  ██  ██ ██           ██      ██ ██   ██ ██    ██ ██           ██ 
██      ██ ███████ ███████ ███████ ██   ██  ██████  ███████ ███████ 
*/
app.factory("MessageFactory", function($http, $q, GlobalSettings){
  function newMessage(payload){
    return $http.post("http://"+window.location.host+"/api/applications/messages", {
      payload: payload
    }, {
      headers: {
      'X-IOTFW-AppToken': GlobalSettings.app.appToken,
      'X-IOTFW-AppSecret': GlobalSettings.app.appSecret
      }
    });
  }
  return {
    newMessage: newMessage
  };
});
/*
 █████  ██████  ██████  ██      ██  ██████  █████  ████████ ██  ██████  ███    ██ ███████ 
██   ██ ██   ██ ██   ██ ██      ██ ██      ██   ██    ██    ██ ██    ██ ████   ██ ██      
███████ ██████  ██████  ██      ██ ██      ███████    ██    ██ ██    ██ ██ ██  ██ ███████ 
██   ██ ██      ██      ██      ██ ██      ██   ██    ██    ██ ██    ██ ██  ██ ██      ██ 
██   ██ ██      ██      ███████ ██  ██████ ██   ██    ██    ██  ██████  ██   ████ ███████ 
*/
app.factory("ApplicationFactory", function($http, $q){
  function newApplication(application){
    return $http.post("http://"+window.location.host+"/api/applications/new",{
      name: application.name,
      description: application.description
    });
  }
  function applications(){
    var def=$q.defer();
    $http.get("http://"+window.location.host+"/api/applications")
    .then(function(response){
      return def.resolve(response.data);
    });
    return def.promise;
  }
  return {
    newApplication,
    applications: applications
  };
});