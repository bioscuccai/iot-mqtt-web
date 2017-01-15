app.controller("MenuCtrl", function($scope, $rootScope, GlobalSettings){
  $scope.apps = GlobalSettings.cachedApps;
  $scope.selectedApp = {
    id: GlobalSettings.selectedApp._id
  };

  $scope.selectedAppChanged = function () {
    console.log("app changed");
    GlobalSettings.selectedApp = _.find(GlobalSettings.cachedApps, ['_id', $scope.selectedApp.id]);

    $rootScope.$broadcast("selectedAppChanged");
  };
});
