angular.module('pushbudget').controller('transCtrl', function ($scope, transactionService, userRef) {

    var testUserId = "5696bd87e4b07f04a7491c6b";

    console.log(userRef);
    console.log(userRef.budget);
    $scope.budget = userRef.budget;
    $scope.allTrans = $scope.transactions;
    $scope.setOption = function(){
      $scope.selectedSub = $scope.currentUser.budget.subbudgets[0].category;
    }
    $scope.setOption();
    console.log($scope.selectedSub);
});
