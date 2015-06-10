angular.module('iPrice.services', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
})
    .factory('DataSvc', ['$http','$q', 'Loki', 'afConfig', function($http, $q, Loki, afConfig){
        var _deferredProducts = $q.defer(),
            _deferredNews = $q.defer(),
            _deferred = $q.defer();

        var _db = new Loki('data');
        var res = {
            dataReady : _deferred.promise,
            products:{
                brand:{},
                rubric:{}
            }
        };

        _db.addCollection('products', {indices:['brand', 'rubric', 'reference','collection', 'id']});
        _db.addCollection('rubric', {indices:['keywords', 'id']});
        _db.addCollection('brand', {indices:['keywords', 'id']});

        _db.addCollection('news', {indices:['id'],unique:['id']});

        res.getCollection = function(collection){
            return _db.getCollection(collection);
        };


        $.ajax({
            type: 'GET',
            url: afConfig.apiRootUrl + 'news.jsonp?callback=NEWS_CALLBACK',
            //async: false,
            jsonpCallback: 'NEWS_CALLBACK',
            //contentType: "application/json",
            dataType: 'jsonp',
            success: function(data) {
                _deferredNews.resolve({data: data, status:200});
            },
            error: function(e) {
                _deferredNews.reject({data:'News unavailable', status:404});
            }
        });


        $.ajax({
            type: 'GET',
            url: afConfig.apiRootUrl + 'products.jsonp?callback=JSON_CALLBACK',
            //async: false,
            jsonpCallback: 'JSON_CALLBACK',
            //contentType: "application/json",
            dataType: 'jsonp',
            success: function(data) {
                _deferredProducts.resolve({data: data, status:200});
            },
            error: function(e) {
                _deferredProducts.reject({data:'Products unavailable', status:404});
            }
        });

        $q.all([
            _deferredProducts.promise.then(function(data){
                var products = res.getCollection('products');
                var rubrics = res.getCollection('rubric');
                var brands = res.getCollection('brand');
                var collections = res.getCollection('collection');

                products.insert(data.data);
                products.mapReduce(function(obj){
                    return  obj;
                }, function(objs){
                    for(var i = 1; i <= objs.length; i++){
                        var obj = objs[i-1];
                        if(obj != null && !rubrics.findOne({title: obj.rubric})){
                            rubrics.insert({
                                id:i,
                                title:obj.rubric,
                                image:obj.rubricImage,
                                keywords:(obj.rubric || '').toLowerCase()
                            });

                            res.products.rubric[obj.rubric] = products.addDynamicView(obj.rubric);
                            res.products.rubric[obj.rubric].applyFind({ rubric: obj.rubric });
                            res.products.rubric[obj.rubric].applySimpleSort('id');//applySort
                        }
                    }
                });

                products.mapReduce(function(obj){
                    return  obj;
                }, function(objs){
                    for(var i = 1; i <= objs.length; i++){
                        var obj = objs[i-1];
                        if(obj != null && !brands.findOne({title: obj.brand})){
                            brands.insert({
                                id:i,
                                title:obj.brand,
                                image:obj.brandImage,
                                keywords:(obj.brand || '').toLowerCase()
                            });

                            res.products.brand[obj.brand] = products.addDynamicView(obj.brand);
                            res.products.brand[obj.brand].applyFind({ brand: obj.brand });
                            res.products.brand[obj.brand].applySimpleSort('id');//applySort
                        }
                    }
                });
            }), _deferredNews.promise.then(function(data){
                res.getCollection('news').insert(data.data);
            })])
            .then(function(data){
                _deferred.resolve();
            },function(data){
                _deferred.reject();
            });



        return res;

    }])
.factory('NewsSvc', ['$http','$q', 'DataSvc', function($http, $q, DataSvc){
      var res = {};
      var url = 'api/news.json';

      //if current <= 0, get the latest number news
      //else get all news after current one
      res.all = function(current, number){//每次获取的新闻数
        var deferred = $q.defer();
            deferred.resolve({data:DataSvc.getCollection('news').data, status:200});

        //$http({method: 'GET', url: url}).
        //    success(function(data, status) {
        //        deferred.resolve({data: data, status: status});
        //    }).
        //    error(function(data, status) {
        //      deferred.reject({data: data, status: status});
        //    });
        return deferred.promise;
      };

    res.get = function(id){
        id = angular.isNumber(id) ? id : parseInt(id, 10);
        var deferred = $q.defer();

        var _res = DataSvc.getCollection('news').findOne({id: id});
        if(_res){
            deferred.resolve({data: _res, status:200});
        }else{
            deferred.reject({data: 'Not found', status:404});
        }


      //$http({method: 'GET', url: url}).
      //    success(function(data, status) {
      //      var _news = undefined;
      //
      //      for(var i = 0; i< data.length; i++){
      //        if(data[i].id == id){
      //          _news = data[i];
      //          break;
      //        }
      //      }
      //      if(_news){
      //        deferred.resolve({data: _news, status: status});
      //      }else{
      //        deferred.reject({data: _news, status: status});
      //      }
      //    }).
      //    error(function(data, status) {
      //      deferred.reject({data: data, status: status});
      //    });
      return deferred.promise;
    }
      return res;
    }])
    .factory('RubricsSvc', ['$http','$q', 'DataSvc', function($http, $q, DataSvc){
      var res = {};
      var url = 'api/rubrics.json';

      res.all = function(){
        var deferred = $q.defer();

          deferred.resolve({data: DataSvc.getCollection('rubric').data, status: 200});
        //$http({method: 'GET', url: url}).
        //    success(function(data, status) {
        //      deferred.resolve({data: data, status: status});
        //    }).
        //    error(function(data, status) {
        //      deferred.reject({data: data, status: status});
        //    });
        return deferred.promise;
      };

      res.get = function(id){
          id = angular.isNumber(id) ? id : parseInt(id, 10);
          var deferred = $q.defer();

          deferred.resolve({data:DataSvc.products['rubric'][_category.title].data(), status:200});



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

    .factory('ProductsSvc', ['$http','$q', 'DataSvc', function($http, $q, DataSvc){

      var res = {};
      var url = 'api/product/{id}.json';

	  res.getByCategory = function(category, id){//category can be brands or rubrics here
          id = angular.isNumber(id) ? id : parseInt(id, 10);
          var deferred = $q.defer();
          var _category = DataSvc.getCollection(category).findOne({id:id});
          if(_category){
              deferred.resolve({data:DataSvc.products[category][_category.title].data(), status:200});
          }else{
              deferred.reject({data: [], status:404});
          }

        //$http({method: 'GET', url: 'api/{category}/{id}.json'.replace(/\{id\}/ig, id).replace(/\{category\}/ig, category)}).
        //    success(function(data, status) {
        //      deferred.resolve({data: data, status: status});
        //    }).
        //    error(function(data, status) {
        //      deferred.reject({data: data, status: status});
        //    });
        return deferred.promise;
      }
      res.get = function(id){
          id = angular.isNumber(id) ? id : parseInt(id, 10);
          var deferred = $q.defer();

          var _res = DataSvc.getCollection('products').findOne({id: id});
          if(_res){
              deferred.resolve({data: _res, status:200});
          }else{
              deferred.reject({data: 'Not found', status:404});
          }

        //$http({method: 'GET', url: url.replace(/\{id\}/ig, id)}).
        //    success(function(data, status) {
        //      deferred.resolve({data: data, status: status});
        //    }).
        //    error(function(data, status) {
        //      deferred.reject({data: data, status: status});
        //    });
        return deferred.promise;
      }
      return res;
    }])
.factory('BrandsSvc', ['$http','$q','DataSvc', function($http, $q, DataSvc) {
        var res = {};
        var url = 'api/brands.json';

        res.all = function(){//每次获取的新闻数
            var deferred = $q.defer();

            deferred.resolve({data: DataSvc.getCollection('brand').data, status: 200});
            //$http({method: 'GET', url: url}).
            //    success(function(data, status) {
            //        deferred.resolve({data: data, status: status});
            //    }).
            //    error(function(data, status) {
            //        deferred.reject({data: data, status: status});
            //    });
            return deferred.promise;
        };

        res.search = function(query){
            var res = {};
            if(query){
                //query = query.toLowerCase();
                query = new RegExp(query, 'gi');

                res.brands = DataSvc.getCollection('brand').find({keywords:{ $regex: query}});
                res.products = DataSvc.getCollection('products').where(function(item){
                    return query.test(item.brand) || query.test(item.title) || query.test(item.rubric) || query.test(item.reference);
                });

            }else{
                res.brands = DataSvc.getCollection('brand').data;
                res.products = [];
            }
           return res;
        }

        return res;
}]);
