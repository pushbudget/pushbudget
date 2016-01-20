angular.module('pushbudget.controllers', [])

.controller('homeCtrl', function($scope) {})



.controller('createCtrl', function($scope) {

})


.controller('AccountCtrl', function($scope) {
  // this has to be moved to a service
  // var sandboxHandler = Plaid.create({
  //   clientName: 'pushbudget',
  //   env: 'tartan',
  //   product: 'auth',
  //   key: 'test_key',
  //   onSuccess: function(token) {
  //     window.location = '/accounts.html?public_token=' + token;
  //   }
  // });
  //
  // $scope.openLink = function() {
  //   console.log('open the link modal');
  //   sandboxHandler.open();
  // };
});
