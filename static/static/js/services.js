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
███    ███ ███████ ███████ ███████  █████   ██████  ███████ ███████ 
████  ████ ██      ██      ██      ██   ██ ██       ██      ██      
██ ████ ██ █████   ███████ ███████ ███████ ██   ███ █████   ███████ 
██  ██  ██ ██           ██      ██ ██   ██ ██    ██ ██           ██ 
██      ██ ███████ ███████ ███████ ██   ██  ██████  ███████ ███████ 
*/
app.factory("MessageFactory", function($http, $q, GlobalSettings){
  function newMessage(payload){
    return $http.post("http://"+window.location.host+"/api/applications/messages", {
      payload: JSON.stringify(payload)
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
