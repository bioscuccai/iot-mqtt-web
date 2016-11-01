app.controller("DefaultCtrl", function($scope, credentials, GlobalSettings){
  $scope.credentials=credentials;
  $scope.appSettings=GlobalSettings.app;
});

app.controller("MenuCtrl", function($scope, GlobalSettings){
  $scope.app=GlobalSettings.app;
});

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
  var readings=readings.readings;
  $scope.fields=_(readings).map("data").compact().map(function(e){
    return Object.keys(e);
  }).flatten().uniq().value();
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
    validData=_(validReadings).map("data").compact().value().slice(-20);
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
