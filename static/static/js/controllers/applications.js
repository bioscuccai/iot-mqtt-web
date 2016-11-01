app.controller("ApplicationsCtrl", function($scope, $mdToast, $mdDialog, ApplicationFactory, GlobalSettings, applications){
  $scope.applications=applications;
  $scope.existingApplication=false;
  $scope.selectedApplication={};
  
  $scope.newApplicationDialog=function(){
    console.log('new app dialog');
    $scope.existingApplication=false;
    $scope.selectedApplication={};
    $scope.openNewApplicationDialog();
  };

  $scope.openEditApplicationDialog=function(){
    $mdDialog.show({
      templateUrl: 'modals/applications/edit.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    });
  };

  $scope.openNewApplicationDialog=function(){
    $mdDialog.show({
      templateUrl: 'modals/applications/new.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    });
  };

  $scope.saveApplication = function () {
    $mdDialog.hide();
    ApplicationFactory.saveApplication($scope.selectedApplication)
    .then(function(response){
      $mdToast.showSimple("Application modified");
      $scope.refreshApplications();
    });
  };

  $scope.createApplication = function (){
    $mdDialog.hide();
    ApplicationFactory.newApplication($scope.selectedApplication)
    .then(function(response){
      $mdToast.showSimple("Application created");
      $scope.refreshApplications();
    });
  };

  $scope.cancelApplicationDialog=function(){
    $mdDialog.cancel();
  };
  
  $scope.selectApplication=function(app){
    $scope.existingApplication=true;
    $scope.selectedApplication=angular.copy(app);
    console.log(app);
    $scope.openEditApplicationDialog();
  };
  
  $scope.refreshApplications=function(){
    ApplicationFactory.applications()
    .then(function(response){
      $scope.applications=response;
    });
  };
  
  $scope.selectApplicationDialog=function(app){
    GlobalSettings.app.appToken=$scope.selectedApplication.token;
    GlobalSettings.app.appSecret=$scope.selectedApplication.secret;
    GlobalSettings.app.name=$scope.selectedApplication.name;
    $mdDialog.hide();
    $mdToast.showSimple("Application selected");
  };
  
  $scope.closeApplicationDialog=function(){
     $mdDialog.cancel();
  };
});
