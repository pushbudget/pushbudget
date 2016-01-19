angular.module('pushbudget').controller('transCtrl', function ($scope, transactionService, userRef) {

    var testUserId = "5696bd87e4b07f04a7491c6b";

    console.log(userRef);

    $scope.setOptions = function(){
      $scope.transactionsOptions = [''];
      console.log(userRef.budget.subbudgets);
      for(var e in userRef.budget.subbudgets){
        console.log(userRef.budget.subbudgets[e].category);
        $scope.transactionsOptions.push(userRef.budget.subbudgets[e].category);
      }
      //$scope.filterOption = $scope.transactionsOptions[0];
      // $scope.transactionOptions
    }

    $scope.setOptions();
    // $scope.transactionsOptions = ['Untagged Transactions','Plaid Category', 'All Transactions', 'Food', 'Gas', 'Deposit'];

});
