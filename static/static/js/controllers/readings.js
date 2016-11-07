app.controller("ReadingsCtrl", function($scope, $mdDialog, $mdToast, ReadingFactory, ApplicationFactory, devices, applications){
  $scope.newReading={
    meta: {
      loc: [0,0]
    }
  };
  $scope.page={
    page: 0,
    total: 0,
    perPage: "25",
    pageCount: 0
  };

  $scope.total=0;
  $scope.readings=[];
  $scope.devices=devices;
  $scope.applications = applications;
  $scope.selectedFilter={};
  $scope.typeFilter={
    state: false
  };
  $scope.deviceTypes=_(devices).map("type").uniq().compact().value();
  $scope.deviceNames=_(devices).map(function (item) {
    return item.name;
  }).sortBy().uniq().value();

  $scope.refreshReadings=function(){
    var page={
      limit: $scope.page.perPage,
      skip: $scope.page.page*$scope.page.perPage
    };
    ReadingFactory.readings(_.assign({}, ($scope.typeFilter.state ? $scope.selectedFilter : {}), page))
    .then(function (readings) {
      $scope.readings=readings.readings;
      $scope.page.total=readings.total;
      $scope.page.pageCount=Math.floor(readings.total / parseInt($scope.page.perPage));
      $scope.readings=$scope.readings.map(function(item){
        return _.merge(item, {dataStr: JSON.stringify(item.data, null, 2)});
      });
    });
  };

  $scope.processReading=function(){
    ReadingFactory.newReading($scope.newReading.token, $scope.newReading.data, $scope.newReading.type, $scope.newReading.meta)
    .then(function (response) {
      console.log(response);
      $mdToast.showSimple("Reading created");
    })
    .catch(function(err){
      $mdToast.showSimple("Reading creation failed!");      
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

  $scope.nextPage=function(){
    var prevIndex=$scope.page.page;    
    $scope.page.page=_.clamp($scope.page.page+1, 0, Math.floor($scope.page.total/$scope.page.perPage));
    if(prevIndex===$scope.page.page){
      return;
    }
    $scope.refreshReadings();
  };

  $scope.prevPage=function(){
    var prevIndex=$scope.page.page;
    $scope.page.page=_.clamp($scope.page.page-1, 0, Math.floor($scope.page.total/$scope.page.perPage));
    if(prevIndex===$scope.page.page){
      return;
    }
    $scope.refreshReadings();
  }
  
  $scope.deleteDialog = function () {
  			ReadingFactory.deleteReading($scope.selectedReading)
  			.then(function () {
  					$mdDialog.hide();
  					$mdToast.showSimple('Application has been deleted');
  			})
  			.catch(function (err) {
  					$mdDialog.hide();
  					console.log(err);
  					$mdToast.showSimple('Application has not been deleted!');
  			});
  };
});
