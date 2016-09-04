app.controller("DevicesCtrl", function($scope, $mdDialog, $mdToast, DeviceFactory, devices, applications){
  $scope.devices=devices;
  $scope.applications=applications;
  $scope.selectedDevice={
    application: {}
  };
  $scope.existingDevice=false;
  $scope.newDeviceModal=function(){
    $scope.selectedDevice={
      application: {}
    };
    $scope.existingDevice=false;
    $scope.deviceModal();
  };
  $scope.deviceModal=function(){
    $mdDialog.show({
      templateUrl: 'modals/device.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    })
    .then(function(dialogRes){
      console.log("creating device");
      $scope.processDevice();
    })
    .catch(function(e){
      console.log("cancelling");
    });
  };
  
  $scope.selectDevice=function(device){
    $scope.selectedDevice=angular.copy(device);
    $scope.existingDevice=true;
    $scope.deviceModal();
  };
  
  $scope.processDevice=function(){
    console.log($scope.selectedDevice);
    var prom=$scope.existingDevice ?
      DeviceFactory.modifyDevice($scope.selectedDevice.token, $scope.selectedDevice.name, $scope.selectedDevice.type) :
      DeviceFactory.newDevice($scope.selectedDevice.name, $scope.selectedDevice.type, $scope.selectedDevice.application.name);
    prom
    .then(function (res) {
      console.log(res);
      $mdToast.showSimple("Device created");
      $scope.refreshDevices();
    })
    .catch(function (err) {
      $mdToast.showSimple("Device creation failed");
      console.log(err);
    });
  };
  
  $scope.cancelDialog=function(){
    $mdDialog.cancel();
  };
  
  $scope.applyDialog=function(){
    $mdDialog.hide();
  };
  
  $scope.refreshDevices=function(){
    DeviceFactory.devices()
    .then(function (devices) {
      $scope.devices=devices;
    });
  };
  
  $scope.regenToken=function(){
    
  };
});