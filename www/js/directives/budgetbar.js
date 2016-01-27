angular.module('pushbudget').directive('pbBudgetbar', function() {
  return {
    templateUrl: 'js/directives/templates/budgetbar.html',
    restrict: 'E',
    scope: {
      total: '=',
      spent: '=',
      savings: '=',
    },
    link: function($scope, element, attrs) {
        $scope.$watchGroup(["total", "spent", "savings"],function(newValues ,oldValues) {
          var total = parseFloat(newValues[0]);
          var spent = parseFloat(newValues[1]);
          var savings = parseFloat(newValues[2]);
          console.log(total,spent,savings);
          var remain = total - savings - spent;
          var pct = (remain/(total-savings))*100;
          if (isNaN(remain) || total === 0 ){
            $scope.budgetBarPct = false;
            $scope.budgetBarRemain = 0.00;
          }else {
            $scope.budgetBarPct = pct;
            $scope.budgetBarRemain = parseFloat(remain).toFixed(2);
          }
      },true);
     },
    controller: function($scope) {
    }
  };
});
