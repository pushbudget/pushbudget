angular.module('pushbudget').directive('pbBudgetcat', function() {

  return {
    templateUrl: 'js/directives/templates/budgetcats.html',
    restrict: 'E',
    scope: {
      init: '@',
      name: '@',
      color: '@',
      unallocated: '@',
      id: '@',
      value: '=',
      total: '@',
      input: '='
    },
    link: function($scope, element, attrs) {
        $scope.$watch('total', function(newVal, oldVal){ //this compensates for a change to the budget so the initial value does not change proportionally to it
          var factor = oldVal/newVal;
          $scope.input = parseFloat($scope.input)*factor;
        });
        $scope.$watchGroup(["unallocated", "input"],function(newValues ,oldValues) {
          var value = $scope.value;
          var total = parseInt($scope.total);
          var unallocated = newValues[0];
          var input = newValues[1]; //% of the chart
          var valuePct = (value/total);
          var unallocatedPct = (unallocated/total);
          var max = valuePct*100 + unallocatedPct*100;
          var output = (input/100)*total;
          $scope.max = max;
          $scope.value = output;
          $scope.displayValue = parseFloat(output).toFixed(2);
      });

     },
    // link: function($scope, element, attrs) {
    //     $scope.$watchGroup(["unallocated", "value"],function(newValues ,oldValues) {
    //       var unallocated = parseFloat(newValues[0]);
    //       var value = parseFloat(newValues[1]);
    //       var max = value + unallocated;
    //       //console.log(name,':',max, '=', value ,'+',unallocated);
    //       $scope.displayValue = parseFloat(value).toFixed(2);
    //       $scope.value = String(value);
    //       $scope.max = String(max);
    //   });
    //
    //  },
    controller: function($scope) {
    }
  };
});
