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

    .controller('ProductListCtrl',  ['$scope','$stateParams','ProductsSvc', '_','$state',function($scope, $stateParams, ProductsSvc, _, $state) {
		$scope.category = $state.current.data.category;
        $scope.detailUrl = '';
		ProductsSvc.getByCategory($scope.category, $stateParams.id).then(function(data){
			$scope.products = _.groupBy(data.data, function(item){
				return item.brand;
			});
		
			$scope.brands = _.sortBy(Object.keys($scope.products), function(brand){ 
				return brand;
			});

			if(data.data instanceof Array && data.data[0]){
				$scope.title = data.data[0][$scope.category];
                if($state.current.data.category == 'rubric'){
                    $scope.detailUrl = "#/home/rubrics-products/";
                }else{
                    $scope.detailUrl = "#/home/brands-products/";
                }
			}else{
				$scope.title = undefined;
			}
		});
    }])

    .controller('ProductDetailCtrl',  ['$scope','$stateParams','ProductsSvc','$ionicSlideBoxDelegate',function($scope, $stateParams, ProductsSvc, $ionicSlideBoxDelegate) {
        ProductsSvc.get($stateParams.id).then(function(data){
            $scope.product = data.data;
            $scope.prices = Object.keys(data.data.prices || {});
            $ionicSlideBoxDelegate.update();
        });
    }])

    .controller('BrandsCtrl', ['$scope','BrandsSvc','_', function($scope, BrandsSvc, _) {
        $scope.$on('$ionicView.enter', function(){
            $scope.$hasHeader = true;
        });

        BrandsSvc.all().then(function(data){
            $scope.brands = data.data;
        });

        $scope.products = [];

        $scope.query = {term:undefined};

        $scope.search = function() {
            var res  = BrandsSvc.search($scope.query.term);
            $scope.brands = res.brands;
            $scope.products = res.products;
        }

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