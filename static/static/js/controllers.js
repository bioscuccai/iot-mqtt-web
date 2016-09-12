app.controller("DefaultCtrl", function($scope, credentials, GlobalSettings){
  $scope.credentials=credentials;
  $scope.appSettings=GlobalSettings.app;
});

app.controller("MenuCtrl", function($scope, GlobalSettings){
  $scope.app=GlobalSettings.app;
});

var read;
/*
 ██████ ██   ██  █████  ██████  ████████ ███████ 
██      ██   ██ ██   ██ ██   ██    ██    ██      
██      ███████ ███████ ██████     ██    ███████ 
██      ██   ██ ██   ██ ██   ██    ██         ██ 
 ██████ ██   ██ ██   ██ ██   ██    ██    ███████ 
*/
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
    var selectedFields=Object.keys($scope.fieldStates).filter(function(item){
      return $scope.fieldStates[item];
    });
    console.log(selectedFields);
    console.log("readings");
    console.log(readings);
    var validReadings=readings;
    if($scope.selectedFilter.type){
      console.log("filtering");
      validReadings=validReadings.filter(function(item){
        return item.type==$scope.selectedFilter.type;
      });
    } else {
      console.log("not filtering");
    }
    validData=_.chain(validReadings).pluck("data").compact().value().slice(-20);
    console.log(validData);
    
    
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

/*
 █████  ██████  ██████  ██      ██  ██████  █████  ████████ ██  ██████  ███    ██ ███████ 
██   ██ ██   ██ ██   ██ ██      ██ ██      ██   ██    ██    ██ ██    ██ ████   ██ ██      
███████ ██████  ██████  ██      ██ ██      ███████    ██    ██ ██    ██ ██ ██  ██ ███████ 
██   ██ ██      ██      ██      ██ ██      ██   ██    ██    ██ ██    ██ ██  ██ ██      ██ 
██   ██ ██      ██      ███████ ██  ██████ ██   ██    ██    ██  ██████  ██   ████ ███████ 
*/
app.controller("ApplicationsCtrl", function($scope, $mdToast, $mdDialog, ApplicationFactory, GlobalSettings, applications){
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
        $scope.refreshApplications();
      });
    } else {
      ApplicationFactory.newApplication($scope.selectedApplication)
      .then(function(response){
        $mdToast.showSimple("Application created");
        $scope.refreshApplications();
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
