angular.module('pushbudget').controller('transCtrl', function ($scope) {

  $scope.allCategories = $scope.userSubBudgets.slice();
  $scope.allCategories.unshift({
    transactions: $scope.userUntagged,
    category: 'Untagged'
  });
  $scope.selectedSub = $scope.allCategories[0];


});
