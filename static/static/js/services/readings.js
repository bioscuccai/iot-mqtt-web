app.factory("ReadingFactory", function($http, $q, GlobalSettings){
  function readings(query_) {
    var query=query_ || {};
    var def=$q.defer();
    $http.get("http://" + window.location.host + "/api/readings", {
      params: {
        filterDevice: query.deviceName,
        filterDeviceType: query.deviceType,
        filterType: query.type,
        limit: query.limit,
        skip: query.skip
      }, headers: {
        'X-IOTFW-AppToken': GlobalSettings.app.appToken,
        'X-IOTFW-AppSecret': GlobalSettings.app.appSecret
      }
    })
    .then(function(response) {
      return def.resolve(response.data);
    })
    .catch(function(err) {
      return def.resolve(err);
    });
    return def.promise;
  }
  
  function newReading(token, data, type, meta) {
    return $http.post("http://" + window.location.host + "/api/readings", {
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

  function saveReading (reading) {
    return $http.post("http://" + window.location.host + "/api/readings/" + reading._id, {
      type: reading.type,
      data: reading.data
    }, {
      headers: {
        'X-IOTFW-AppToken': GlobalSettings.app.appToken,
        'x-iotfw-devicetoken': token
      }
    });
  }
  
  function deleteReading(reading) {
    return $http.post("http://" + window.location.host + "/api/readings/" + reading._id + "?_method=DELETE");
  }

  return {
    readings: readings,
    newReading: newReading,
    saveReading,
    deleteReading
  };
});
