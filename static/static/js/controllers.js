app.controller("DefaultCtrl", function($scope, credentials){
  $scope.credentials=credentials;
});

app.controller("DevicesCtrl", function($scope, $mdDialog, $mdToast, DeviceFactory, devices, applications){
  $scope.devices=devices;
  $scope.applications=applications;
  $scope.selectedDevice={};
  $scope.existingDevice=false;
  $scope.newDeviceModal=function(){
    $scope.selectedDevice={};
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
      DeviceFactory.newDevice($scope.selectedDevice.name, $scope.selectedDevice.type);
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
app.controller("ReadingsCtrl", function($scope, $mdDialog, $mdToast, ReadingFactory, devices){
  $scope.newReading={};
  $scope.readings=[];
  $scope.devices=devices;
  $scope.selectedFilter={};
  $scope.deviceTypes=_.chain(devices).pluck("type").unique().compact().value();
  $scope.deviceNames=_.chain(devices).map(function (item) {
    return item.name;
  }).sortBy().unique().value();
  console.log($scope.deviceTypes);
  
  $scope.refreshReadings=function(){
    ReadingFactory.readings($scope.selectedFilter)
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

var read;
app.controller("ChartsCtrl", function($scope, WsFactory, readings){
  $scope.chart={
    data: [[1,1]],
    series: ['a'],
    labels: ['', '']
  };
  $scope.selectedFilter={
    type: ""
  };
  read=readings;
  $scope.fields=_.chain(readings).pluck("data").compact().map(function(e){
    return Object.keys(e);
  }).flatten().unique().value();
  console.log($scope.fields);
  $scope.fieldStates={};
  $scope.data=[[1,1]];
  $scope.series=['a'];
  $scope.labels=['', ''];
  var validData=[];
  $scope.fieldsChanged=function(){
    //console.log($scope.fieldStates);
    var selectedFields=Object.keys($scope.fieldStates).filter(function(item){
      return $scope.fieldStates[item];
    });
    console.log(selectedFields);
    validData=_.chain(readings).pluck("data").compact().value().slice(-10);
    console.log(validData);
    if($scope.selectedFilter.type){
      validData=validData.filter(function(item){
        return item.type==$scope.selectedFilter.type;
      });
    }
    
    $scope.chart.data=selectedFields.map(function(item){
      var col=[];
      validData.forEach(function(vd){
        col.push(vd[item]||0);
      });
      return col;
    });
    $scope.chart.series=selectedFields;
    console.log($scope.chart.series);
    $scope.chart.labels=_.fill(new Array(validData.length), '');
    console.log($scope.chart.labels);
    console.log($scope.chart.data);
  };
  
  WsFactory.on("new_reading", function(reading){
    console.log("new reading");
    console.log(reading.data);
    readings.push(reading);
    $scope.fieldsChanged();
  });
});

app.controller("MessagesCtrl", function($scope, $mdDialog, $mdToast, MessageFactory){
  $scope.newMessage={
    payload: JSON.stringify({
      "targetDevice": "",
      "targetDeviceType": "",
      "message": "ok"
    }, null, 2)
  };
  $scope.sendMessage=function(){
    MessageFactory.newMessage($scope.newMessage.payload)
    .then(function(res){
      $mdToast.showSimple("Message sent");
    });
  };
});

app.controller("ApplicationsCtrl", function($scope, $mdToast, $mdDialog, ApplicationFactory, applications){
  $scope.applications=applications;
  $scope.existingApplication=false;
  $scope.selectedApplication={};
  
  $scope.newApplicationDialog=function(){
    $scope.existingApplication=false;
    $scope.selectedApplication={};
    $scope.applicationDialog();
  };
  $scope.applicationDialog=function(){
    $mdDialog.show({
      templateUrl: 'modals/application.html',
      clickOutsideToClose: true,
      scope: $scope,
      preserveScope: true
    });
  };
  $scope.applyApplicationDialog=function(){
    $mdDialog.hide();
    if($scope.existingApplication){
      ApplicationFactory.modifyApplication($scope.selectedApplication)
      .then(function(response){
        $mdToast.showSimple("Application modified");
      });
    } else {
      ApplicationFactory.newApplication($scope.selectedApplication)
      .then(function(response){
        $mdToast.showSimple("Application created");
      });
    }
  };
  $scope.cancelApplicationDialog=function(){
    $mdDialog.cancel();
  };
  
  $scope.selectApplication=function(app){
    $scope.existingApplication=true;
    $scope.selectedApplication=angular.copy(app);
    console.log(app);
    $scope.applicationDialog();
  };
  
  $scope.refreshApplications=function(){
    ApplicationFactory.applications()
    .then(function(response){
      $scope.applications=response;
    });
  };
});
