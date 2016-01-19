angular.module('pushbudget').directive('pbBudgetcat', function() {
  // return {
  //   templateUrl: 'js/directives/templates/budgetcats.html',
  //   restrict: 'E',
  //   scope: {
  //     name: '@',
  //     color: '@',
  //     total: '=',
  //     spent: '=',
  //   },
  //   link: function($scope, element, attrs) {
  //       $scope.$watchGroup(["total", "spent"],function(newValues ,oldValues) {
  //         var total = parseFloat(newValues[0]);
  //         var spent = parseFloat(newValues[1]);
  //         var remain = total - spent;
  //         var pct = (remain/total)*100;
  //         if (isNaN(remain) || total === 0 ){
  //           $scope.budgetPct = false;
  //         }else {
  //           $scope.budgetPct = pct;
  //         }
  //     },true);
  //
  //    },
  //   controller: function($scope) {
  //   }
  // };

  return {
    templateUrl: 'js/directives/templates/budgetcats.html',
    restrict: 'E',
    scope: {
      name: '@',
      color: '@',
      value: '=',
      max: '='
    },
    link: function($scope, element, attrs) {
        $scope.$watchGroup(["max", "value"],function(newValues ,oldValues) {
          var max = newValues[0];
          var value = parseFloat(newValues[1]);
          // var dif = parseFloat(newValues[1]) - parseFloat(oldValues[1]);
          // $scope.unallocated = unallocated;
          $scope.value = String(value);
          $scope.max = String(max);
          //$scope.max = String(parseFloat(unallocated)+parseFloat(value));
      },true);

     },
    controller: function($scope) {
    }
  };
});
