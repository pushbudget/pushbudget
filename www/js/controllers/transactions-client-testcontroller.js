angular.module('pushbudget').controller('transactionTest', function ($scope, transactionService) {
  console.log("IN THE CONTROLLER");
  $scope.test = 'cheese eater';
  $scope.getTransactions = function () {
    transactionService.getAllUserTransactions().then(function (res) {
      console.log(res);
      $scope.transactions = res;
    })
  }
  console.log($scope.getTransactions());
  transactionService.getAllUserTransactions().then(function (res) {
    console.log(res);
  });
});