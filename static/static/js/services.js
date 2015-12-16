app.factory('WsFactory', function(socketFactory){
  var ioSocket = io.connect('ws://localhost:5000');
  return socketFactory({ioSocket: ioSocket});
});

app.factory('DashboardFactory', function($http, $q){
  function credentials(){
    var def=$q.defer();
    var creds={};
    $http.get("http://localhost:5000/api/credentials")
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

app.factory("DeviceFactory", function($http, $q){
  function devices(){
    var def=$q.defer();
    $http.get("http://localhost:5000/api/devices")
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
    $http.post("http://localhost:5000/api/devices/new", {
      name: name,
      type: type,
      applicationName: applicationName
    })
    .then(function(response){
      return def.resolve(response.data);
    }).catch(function (err) {
      return def.reject(err);
    });
    return def.promise;
  }
  
  function regenToken(oldToken){
    var def=$q.defer();
    $http.post("http://localhost:5000/api/devices/regen_token", {
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

app.factory("ReadingFactory", function($http, $q){
  function readings(query_){
    var query=query_||{};
    var def=$q.defer();
    $http.get("http://localhost:5000/api/readings", {
      params: {
        filterDevice: query.deviceName,
        filterDeviceType: query.deviceType,
        filterType: query.type
      }
    })
    .then(function(response){
      return def.resolve(response.data);
    });
    return def.promise;
  }
  
  function newReading(token, data, type, meta){
    return $http.post("http://localhost:5000/api/readings/new", {
      token: token,
      data: data,
      type: type,
      meta: meta
    });
  }
  
  return {
    readings: readings,
    newReading: newReading
  };
});

app.factory("MessageFactory", function($http, $q){
  function newMessage(payload){
    return $http.post("http://localhost:5000/api/messages", {
      payload: payload
    });
  }
  return {
    newMessage: newMessage
  };
});

app.factory("ApplicationFactory", function($http, $q){
  function newApplication(application){
    return $http.post("http://localhost:5000/api/applications/new",{
      name: application.name,
      description: application.description
    });
  }
  function applications(){
    var def=$q.defer();
    $http.get("http://localhost:5000/api/applications")
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