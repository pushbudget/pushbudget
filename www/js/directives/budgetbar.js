angular.module('pushbudget').directive('pbBudgetbar', function() {
  return {
    templateUrl: 'templates/budgetBar.html',
    scope: {
    },
    controller: function($scope) {
      $scope.budgetBarPct = 54;
      $scope.budgetBarRemain = 1;
    }
  };
});
