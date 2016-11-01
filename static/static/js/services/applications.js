app.factory("ApplicationFactory", function($http, $q){
  function newApplication(application){
    return $http.post("http://"+window.location.host+"/api/applications",{
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

  function saveApplication (application) {
    return $http.post("http://"+window.location.host+"/api/applications/"+application._id, {
      name: application.name,
      description: application.description
    }); 
  }

  function deleteApplication(application) {
    return $http.post("http://" + window.location.host + "/api/applications/" + application._id + "?_method=DELETE");
  }

  return {
    newApplication,
    applications,
    saveApplication,
    deleteApplication
  };
});
