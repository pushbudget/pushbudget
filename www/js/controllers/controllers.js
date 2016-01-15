angular.module('pushbudget.controllers', [])

.controller('homeCtrl', function($scope) {})

.controller('transCtrl', function($scope, $ionicSideMenuDelegate) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.transactions = [
    {
      amount: "$0.20",
      business: "7-11",
      date: "1/11/16"
    },
    {
      amount: "$34.99",
      business: "Wal-Mart",
      date: "1/10/16"
    },
    {
      amount: "$250.00",
      business: "Amazon.com",
      date: "1/10/16"
    },
    {
      amount: "$10,000",
      business: "DevMounta.in",
      date: "1/9/16"
    }
  ];
})


.controller('loginCtrl', function($scope) {})



.controller('createCtrl', function($scope) {

})


.controller('AccountCtrl', function($scope) {
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
});
