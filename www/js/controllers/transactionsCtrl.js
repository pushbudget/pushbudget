angular.module('pushbudget').controller('transCtrl', function ($scope, transactionService) {

    var testUserId = "5696bd87e4b07f04a7491c6b";

    console.log($scope.currentUser);
    console.log($scope.transactions);

    // Dropdown menu ng-options and default option
    $scope.transactionsOptions = ['Untagged Transactions','Plaid Category', 'All Transactions', 'Food', 'Gas', 'Deposit'];
    $scope.filterOption = $scope.transactionsOptions[1];
});
