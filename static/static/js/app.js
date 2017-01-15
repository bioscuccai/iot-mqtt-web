var app = angular.module('app', ['ngMaterial', 'ui.router', 'btford.socket-io', 'chart.js', 'hljs', 'angularUtils.directives.dirPagination']);

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
  },
  pagination: {
    perPage: 100
  },
  selectedApp: {}
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  var menuView = {
    controller: 'MenuCtrl',
    templateUrl: 'templates/menu.html'
  };
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
      },
      menu: menuView
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
      },
      menu: menuView
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
          },
          applications: function(ApplicationFactory){
            return ApplicationFactory.applications();
          }
        }
      },
      menu: menuView
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
      },
      menu: menuView
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
      },
      menu: menuView
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
      },
      menu: menuView
    }
  });
});

app.run(function(ApplicationFactory, GlobalSettings, $rootScope){
  ApplicationFactory.applications()
  .then(applications=>{
    GlobalSettings.cachedApps = applications;
    var lastApp=_.last(applications);
    //console.log(applications);
    _.assign(GlobalSettings.selectedApp, lastApp);
  });

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();
    console.log(error);
  });
});
