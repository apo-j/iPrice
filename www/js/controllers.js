/**
 * Created by chenglian on 15/4/11.
 */
angular.module('iPrice.controllers', [])
    .controller('NewsCtrl', ['$scope', 'NewsSvc',function($scope, NewsSvc) {
        $scope.news = [];

        $scope.doRefresh = function(){
            NewsSvc.all(2, 10).then(function(data){
                    $scope.news.unshiftRange(data.data);
                }
            ).finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
        NewsSvc.all(-1, 10).then(function(data){
                $scope.news.unshiftRange(data.data);
            }
        );
    }])
    .controller('NewsDetailCtrl', ['$scope','$stateParams','NewsSvc',function($scope, $stateParams, NewsSvc) {
        NewsSvc.get($stateParams.id).then(function(data){
            $scope.news = data.data;
        });
    }])

    .controller('RubricsCtrl',  ['$scope','$stateParams','RubricsSvc',function($scope, $stateParams, RubricsSvc) {
        RubricsSvc.all($stateParams.id).then(function(data){
            $scope.rubrics = data.data;
        });
    }])

    .controller('RubricDetailCtrl',  ['$scope','$stateParams','RubricsSvc', '_','$state',function($scope, $stateParams, RubricsSvc, _, $state) {
        RubricsSvc.get($stateParams.id).then(function(data){
            $scope.products = _.groupBy(data.data, function(item){
                return item.brand;
            });

            $scope.brands = _.sortBy(Object.keys($scope.products), function(brand){ return brand;});

            if(data.data && data.data[0]){
                $scope.title = data.data[0].rubric;
            }else{
                $scope.title = undefined;
            }
        });
    }])

    .controller('ProductDetailCtrl',  ['$scope','$stateParams','ProductsSvc','$ionicSlideBoxDelegate',function($scope, $stateParams, ProductsSvc, $ionicSlideBoxDelegate) {
        ProductsSvc.get($stateParams.id).then(function(data){
            $scope.product = data.data;
            $ionicSlideBoxDelegate.update();
        });
    }])

    .controller('BrandsCtrl', ['$scope','BrandsSvc','_', function($scope, BrandsSvc, _) {
        $scope.$on('$ionicView.enter', function(){
            $scope.$hasHeader = true;
        });

        var brands = []

        BrandsSvc.all().then(function(data){
            $scope.brands = brands = data.data;
        });

        $scope.query = {term:undefined};

        $scope.search = function(){
            $scope.brands = _.filter(brands,function(brand){
                if(brand.keywords){
                    var re = new RegExp($scope.query.term, 'gi');
                    return re.test(brand.keywords);
                }else{
                    return false;
                }})};

        $scope.clearQuery = function(){
            $scope.query.term = undefined;
        }
    }])

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });