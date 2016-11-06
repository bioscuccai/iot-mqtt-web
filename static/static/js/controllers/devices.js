app.controller("DevicesCtrl", function($scope, $mdDialog, $mdToast, DeviceFactory, devices, applications){
  $scope.devices=devices;
  $scope.applications=applications;
  $scope.selectedDevice={
    application: {}
  };

  $scope.openEditDeviceModal = function () {
    $mdDialog.show({
      templateUrl: 'modals/devices/edit.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    });
  };

  $scope.saveDevice = function () {
    DeviceFactory
      .saveDevice($scope.selectedDevice)
      .then(function (res) {
        $mdDialog.hide();
        console.log(res);
        $mdToast.showSimple("Device modified");
        $scope.refreshDevices();
      })
      .catch(function (err) {
        $mdToast.showSimple("Device modification failed");
        console.log(err);
      });
  };

  $scope.openNewDeviceModal = function () {
    $scope.selectedDevice={
      application: {}
    };
    $mdDialog.show({
      templateUrl: 'modals/devices/new.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    });
  };

  $scope.createDevice = function () {
    DeviceFactory
      .newDevice($scope.selectedDevice)
      .then(function (res) {
        $mdToast.showSimple("Device created");
        $scope.refreshDevices();
      })
      .catch(function (err) {
        $mdToast.showSimple("Device creation failed");
        console.log(err);
      });
  };

  $scope.selectDevice=function(device){
    $scope.selectedDevice=angular.copy(device);
    $scope.existingDevice=true;
    $scope.openEditDeviceModal();
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
    DeviceFactory.regenToken($scope.selectedDevice._id)
    .then(function(updatedDevice){
      $scope.selectedDevice=updatedDevice;
      return DeviceFactory.devices();
    })
    .then(function(devices){
      $scope.devices=devices;
    });
  };
  
  $scope.deleteDialog = function () {
  			DeviceFactory.deleteDevice($scope.selectedDevice)
  			.then(function (res) {
  					$mdDialog.hide();
  					$mdToast.showSimple('Device has been deleted');
  			})
  			.catch(function (err) {
  					$mdDialog.hide();
  					console.log(err);
  					$mdToast.showSimple('Device has not been deleted!');
  			});
  };
});