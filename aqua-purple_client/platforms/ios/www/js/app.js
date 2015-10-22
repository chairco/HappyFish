// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', "chart.js", 'starter.controllers'])

.constant('ApiEndpoint', {
  url: 'http://ec2-52-88-134-169.us-west-2.compute.amazonaws.com/debug'
  //url: 'http://127.0.0.1:8100'
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      StatusBar.styleLightContent();
    }
    
    var success = function(gmappedport) {
        alert("Handshake completed!(" + gmappedport + ")");
    }

    var failure = function() {
        alert("Error calling Tunnel Plugin");
    }
//hello.greet("World", success, failure);
    //p2ptunnel.startP2PTunnel("A8SPV2MUX7BVXZCP111A", success, failure);
    
    
  });
})

.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#FF8A80'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: false,
      showScale: false
    });
  }])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.collections', {
    url: '/collections',
    views: {
      'menuContent': {
        templateUrl: 'templates/collections.html'
      }
    }
  })

    .state('app.timeline', {
      url: '/timeline',
      views: {
        'menuContent': {
          templateUrl: 'templates/timeline.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.my-aquas', {
      url: '/my-aquas',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-aquas.html'
        }
      }
    })
    .state('app.my-aquas_main', {
      url: '/my-aquas/:ports',
      views: {
        'menuContent': {
          templateUrl: 'templates/aqua_func/main.html'
        }
      }
    })
    .state('app.discover', {
      url: '/discover',
      views: {
        'menuContent': {
          templateUrl: 'templates/discover.html'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/timeline');
});
