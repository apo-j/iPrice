// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('iPrice', ['ionic', 'iPrice.controllers', 'iPrice.services','iPrice.filters'])
    .constant('afConfig', config)

.run(['$ionicPlatform', '$rootScope','afConfig','$state', '$rootScope', function($ionicPlatform, $rootScope, afConfig, $state, $rootScope) {
      //init $rootScope utilities
        $rootScope.config = afConfig;

  $ionicPlatform.ready(function() {
      //admob configuration
      if(window.AdMob) {
          var admobId;

          if ( /(android)/i.test(navigator.userAgent) ) {
              admobId = {
                  banner:"ANDROID_PUBLISHER_KEY",
                  intersitial:"ANDROID_PUBLISHER_KEY"
              };
          } else if( /(ipod|iphone|ipad)/i.test(navigator.userAgent) ) {
              admobId = {
                  banner:"ca-app-pub-3349787729360682/9138553652",
                  intersitial:"ca-app-pub-3349787729360682/3092020058"
              };
          }

          window.AdMob.createBanner({
              'adId': admobId.banner,
              'position': window.AdMob.AD_POSITION.BOTTOM_CENTER,
              'autoShow': true
          });

          window.AdMob.prepareInterstitial( {adId:admobId.intersitial, autoShow:false} );

          if(window.AdMob){
              document.addEventListener('onAdLoaded', window.AdMob.showInterstitial);
          }
      }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
        StatusBar.styleLightContent();
    }

      $state.go('home.news');
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $stateProvider
        // setup an abstract state for the tabs directive
            .state('home', {
                url:'/home',
                abstract:true,
                templateUrl:'templates/home.html'
            })
        // Each tab has its own nav history stack:
            .state('home.news', {
                url:'/news',
                views:{
                    'home-news':{
                        templateUrl:'templates/home-news.html',
                        controller:'NewsCtrl'
                    }
                }
            })
            .state('home.news-detail', {
                url: '/news/:id',
                views: {
                    'home-news': {
                        templateUrl: 'templates/news-detail.html',
                        controller: 'NewsDetailCtrl'
                    }
                }
            })
            .state('home.rubrics', {
                url:'/rubrics',
                views:{
                    'home-rubrics':{
                        templateUrl:'templates/home-rubrics.html',
                        controller:'RubricsCtrl'
                    }
                }
            })
            .state('home.rubrics-products', {
                url: '/rubrics/:id',
                views: {
                    'home-rubrics': {
						data:{
							category:'rubric'
						},
                        templateUrl: 'templates/products-list.html',
                        controller: 'ProductListCtrl'
                    }
                }
            })
            .state('home.rubrics-product', {
                url: '/products/:id',
                views: {
                    'home-rubrics': {
                        templateUrl: 'templates/product-detail.html',
                        controller: 'ProductDetailCtrl'
                    }
                }
            })
            .state('home.brands', {
                url: '/brands',
                views: {
                    'home-brands': {
                        templateUrl: 'templates/home-brands.html',
                        controller: 'BrandsCtrl'
                    }
                }
            })
			.state('home.brands-products', {
                url: '/brands/:id',
                views: {
                    'home-brands': {
						data:{
							category:'brand'
						},
                        templateUrl: 'templates/products-list.html',
                        controller: 'ProductListCtrl'
                    }
                }
            })
            .state('home.brands-product', {
                url: '/products/:id',
                views: {
                    'home-brands': {
                        templateUrl: 'templates/product-detail.html',
                        controller: 'ProductDetailCtrl'
                    }
                }
            })

            .state('home.account', {
                url: '/account',
                views: {
                    'home-account': {
                        templateUrl: 'templates/home-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            }
        );

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/news');

    }])
