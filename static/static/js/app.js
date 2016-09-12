var app = angular.module('app', ['ngMaterial', 'ui.router', 'btford.socket-io', 'chart.js', 'hljs']);



app.config(function(hljsServiceProvider){
  hljsServiceProvider.setOptions({
    tabReplace: '  '
  });
});

app.value('GlobalSettings',{
  app: {
    appToken: 'demo',
    appSecret: 'demo',
    name: 'N/A'
  }
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  
  $stateProvider.state("default", {
    url: '/',
    views: {
      main: {
        controller: 'DefaultCtrl',
        templateUrl: 'templates/default.html',
        resolve:{
          credentials: function(DashboardFactory){
            return DashboardFactory.credentials();
          }
        } 
      }
    }
  });
  
  $stateProvider.state("devices", {
    url: '/devices',
    views: {
      main: {
        controller: 'DevicesCtrl',
        templateUrl: 'templates/devices.html',
        resolve: {
          devices: function(DeviceFactory){
            return DeviceFactory.devices();
          },
          applications: function(ApplicationFactory){
            return ApplicationFactory.applications();
          }
        }
      }
    }
  });
  
  $stateProvider.state("readings", {
    url: '/readings',
    views: {
      main: {
        controller: 'ReadingsCtrl',
        templateUrl: 'templates/readings.html',
        resolve: {
            devices: function(DeviceFactory){
              return DeviceFactory.devices();
          }
        }
      }
    }
  });
  
  $stateProvider.state("charts", {
    url: '/charts',
    views: {
      main: {
        controller: 'ChartsCtrl',
        templateUrl: 'templates/charts.html',
        resolve: {
          readings: function(ReadingFactory){
            return ReadingFactory.readings({limit: 100});
          }
        }
      }
    }
  });
  
  $stateProvider.state("messages", {
    url: '/messages',
    views: {
      main: {
        controller: 'MessagesCtrl',
        templateUrl: 'templates/messages.html',
        resolve: {
          devices: function(DeviceFactory){
            return DeviceFactory.devices();
          }
        }
      }
    }
  });
  
  $stateProvider.state("applications", {
    url: '/applications',
    views: {
      main: {
        controller: 'ApplicationsCtrl',
        templateUrl: 'templates/applications.html',
        resolve: {
          applications: function(ApplicationFactory){
            return ApplicationFactory.applications();
          }
        }
      }
    }
  });
});

app.run(function(ApplicationFactory, GlobalSettings){
  ApplicationFactory.applications()
  .then(applications=>{
    var lastApp=_.last(applications);
    GlobalSettings.app.name=lastApp.name;
    GlobalSettings.app.appToken=lastApp.token;
    GlobalSettings.app.appSecret=lastApp.secret;
    
  });
});