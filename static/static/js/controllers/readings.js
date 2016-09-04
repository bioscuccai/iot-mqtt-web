app.controller("ReadingsCtrl", function($scope, $mdDialog, $mdToast, ReadingFactory, devices){
  $scope.newReading={};
  $scope.readings=[];
  $scope.devices=devices;
  $scope.selectedFilter={};
  $scope.typeFilter={
    state: false
  };
  $scope.deviceTypes=_.chain(devices).pluck("type").unique().compact().value();
  $scope.deviceNames=_.chain(devices).map(function (item) {
    return item.name;
  }).sortBy().unique().value();
  console.log($scope.deviceTypes);
  
  $scope.refreshReadings=function(){
    ReadingFactory.readings($scope.typeFilter.state ? $scope.selectedFilter : {})
    .then(function (readings) {
      $scope.readings=readings;
      $scope.readings=$scope.readings.map(function(item){
        return _.merge(item, {dataStr: JSON.stringify(item.data, null, 2)});
      });
    });
  };
  
  $scope.processReading=function(){
    ReadingFactory.newReading($scope.newReading.token, $scope.newReading.data, $scope.newReading.type, {})
    .then(function (response) {
      console.log(response);
      $mdToast.showSimple("Reading created");
    });
  };
  
  $scope.newReadingDialog=function(){
    $mdDialog.show({
      templateUrl: 'modals/new_reading.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    })
    .then(function (response) {
      $scope.processReading();
    });
  };
  $scope.applyNewReadingDialog=function(){
    console.log("apply clicked");
    $mdDialog.hide();
    console.log($scope.newReading.data);
  };
  
  $scope.closeNewReadingDialog=function(){
    $mdDialog.cancel();
  };
});
