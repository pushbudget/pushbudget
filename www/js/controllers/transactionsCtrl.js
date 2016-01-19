angular.module('pushbudget').controller('transCtrl', function ($scope, transactionService) {

    var testUserId = "5696bd87e4b07f04a7491c6b";
    transactionService.getAllUserTransactions(testUserId).then(function(res){
      $scope.transactions = res;
    });

    // Dropdown menu ng-options and default option
    $scope.transactionsOptions = ['Untagged Transactions', 'All Transactions', 'Food', 'Gas', 'Entertainment'];
    $scope.filterOption = $scope.transactionsOptions[0];
});
