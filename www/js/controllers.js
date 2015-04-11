/**
 * Created by chenglian on 15/4/11.
 */
angular.module('iPrice.controllers', [])
    .controller('HomeCtrl', ['$scope','$state', function($scope, $state){
        $scope.loadPub = function(){
            window.open('http://www.lemonde.fr', '_system', 'location=yes');
            return false;
        }
    }])
    .controller('DashCtrl', function($scope) {})

    .controller('ChatsCtrl', function($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        }
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });