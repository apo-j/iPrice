angular.module('iPrice.services', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
})
.factory('NewsSvc', ['$http','$q', function($http, $q){

      var res = {};
      var url = 'api/news.json';

      //if current <= 0, get the latest number news
      //else get all news after current one
      res.all = function(current, number){//每次获取的新闻数
        var deferred = $q.defer();
        $http({method: 'GET', url: url}).
            success(function(data, status) {
                deferred.resolve({data: data, status: status});
            }).
            error(function(data, status) {
              deferred.reject({data: data, status: status});
            });
        return deferred.promise;
      };

    res.get = function(id){
      var deferred = $q.defer();
      $http({method: 'GET', url: url}).
          success(function(data, status) {
            var _news = undefined;

            for(var i = 0; i< data.length; i++){
              if(data[i].id == id){
                _news = data[i];
                break;
              }
            }
            if(_news){
              deferred.resolve({data: _news, status: status});
            }else{
              deferred.reject({data: _news, status: status});
            }
          }).
          error(function(data, status) {
            deferred.reject({data: data, status: status});
          });
      return deferred.promise;
    }
      return res;
    }])
    .factory('RubricsSvc', ['$http','$q', function($http, $q){

      var res = {};
      var url = 'api/rubrics.json';

      //if current <= 0, get the latest number news
      //else get all news after current one
      res.all = function(){//每次获取的新闻数
        var deferred = $q.defer();
        $http({method: 'GET', url: url}).
            success(function(data, status) {
              deferred.resolve({data: data, status: status});
            }).
            error(function(data, status) {
              deferred.reject({data: data, status: status});
            });
        return deferred.promise;
      };

      res.get = function(id){
        var deferred = $q.defer();
        $http({method: 'GET', url: 'api/rubrics/{id}.json'.replace(/\{id\}/ig, id)}).
            success(function(data, status) {
              deferred.resolve({data: data, status: status});
            }).
            error(function(data, status) {
              deferred.reject({data: data, status: status});
            });
        return deferred.promise;
      }
      return res;
    }])
    .factory('ProductsSvc', ['$http','$q', function($http, $q){

      var res = {};
      var url = 'api/products/{id}.json';

      res.get = function(id){
        var deferred = $q.defer();
        $http({method: 'GET', url: url.replace(/\{id\}/ig, id)}).
            success(function(data, status) {
              deferred.resolve({data: data, status: status});
            }).
            error(function(data, status) {
              deferred.reject({data: data, status: status});
            });
        return deferred.promise;
      }
      return res;
    }])
.factory('BrandsSvc', ['$http','$q',function($http, $q) {
        var res = {};
        var url = 'api/brands.json';

        res.all = function(){//每次获取的新闻数
            var deferred = $q.defer();
            $http({method: 'GET', url: url}).
                success(function(data, status) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function(data, status) {
                    deferred.reject({data: data, status: status});
                });
            return deferred.promise;
        };

        return res;
}]);
