// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('iPrice', ['ionic', 'iPrice.controllers', 'iPrice.services'])
    .constant('afConfig', config)
.run(['$ionicPlatform', '$rootScope','afConfig','$location', function($ionicPlatform, $rootScope, afConfig, $location) {
      $rootScope.config = afConfig;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
        StatusBar.styleLightContent();
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $stateProvider
            .state('home', {
                url:'/',
                templateUrl:'templates/home.html',
                controller:'HomeCtrl'
            })
        // setup an abstract state for the tabs directive
            .state('tab', {
                url:'/tab',
                abstract:true,
                templateUrl:'templates/tabs.html'
            })
        // Each tab has its own nav history stack:
            .state('tab.dash', {
                url:'/dash',
                views:{
                    'tab-dash':{
                        templateUrl:'templates/tab-dash.html',
                        controller:'DashCtrl'
                    }
                }
            })
            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            }
        );

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');

    }])
