angular.module('pushbudget').directive('pbBudgetbar', function() {
  return {
    templateUrl: 'templates/budgetBar.html',
    restrict: 'E',
    scope: {
      total: '=',
      spent: '=',
    },
    link: function($scope, element, attrs) {
        $scope.$watchGroup(["total", "spent"],function(newValues ,oldValues) {
          var total = parseFloat(newValues[0]);
          var spent = parseFloat(newValues[1]);
          var remain = total - spent;
          var pct = (remain/total)*100;
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
