angular.module('pushbudget').controller('transCtrl', function ($scope, transactionService, userRef) {

  var testUserId = "5696bd87e4b07f04a7491c6b";

  console.log(userRef);
  console.log(userRef.budget);
  $scope.budget = userRef.budget;
  $scope.allTrans = $scope.transactions;

});