angular.module('pushbudget').controller('transCtrl', function ($scope) {

  var subBudgets = $scope.userSubBudgets;
  var allCategories = [{
    transactions: $scope.userUntagged,
    category: 'Untagged'
  }];
  for (var i = 0; i < subBudgets.length; i++){
    allCategories.push(subBudgets[i]);
  }
  $scope.allCategories = allCategories;
  $scope.selectedSub = $scope.allCategories[0];


});
