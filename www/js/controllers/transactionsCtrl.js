angular.module('pushbudget').controller('transCtrl', function ($scope) {

  $scope.subBudgets = $scope.user.subbudgetArr;
  var allCategories = [{
    transactions: $scope.user.untaggedArr,
    category: 'Untagged'
  }];
  for (var i = 0; i < $scope.subBudgets.length; i++){
    allCategories.push($scope.subBudgets[i]);
  }
  $scope.allCategories = allCategories;
  $scope.selectedSub = $scope.allCategories[0];

});
