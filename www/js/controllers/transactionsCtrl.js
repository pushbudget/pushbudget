angular.module('pushbudget').controller('transCtrl', function ($scope, transactionService, userRef) {

  var testUserId = "5696bd87e4b07f04a7491c6b";

  console.log(userRef);
  console.log(userRef.budget);
  $scope.budget = userRef.budget;
  $scope.allTrans = $scope.transactions;
  $scope.getUntagged = function () {
    transactionService.getAllUserUntagged(userRef._id).then(function (transactions) {
      var obj = {
        transactions: transactions.data,
        category: 'Untagged'
      }
      $scope.budget.subbudgets.unshift(obj);
      $scope.selectedSub = $scope.budget.subbudgets[0];
    })
  }
  $scope.getUntagged();
});
