angular.module('pushbudget.controllers', [])

.controller('homeCtrl', function($scope) {})

.controller('transCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});



})


.controller('budgetCtrl', function($scope) {})

.controller('loginCtrl', function($scope) {})

.controller('newTransCtrl', function($scope) {})

.controller('createCtrl', function($scope) {
  var sandboxHandler = Plaid.create({
  clientName: 'pushbudget',
  env: 'tartan',
  product: 'auth',
  key: 'test_key',
  onSuccess: function(token) {
    window.location = '/accounts.html?public_token=' + token;
  }
});

$scope.openLink = function() {
  console.log('open the link modal');
  sandboxHandler.open();
};
})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
