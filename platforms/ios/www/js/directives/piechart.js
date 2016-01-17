angular.module('pushbudget').directive('pbPiechart', function() {
  return {
    templateUrl: 'templates/piechart.html',
    restrict: 'E',
    scope: {
      labels: '=',
      values: '=',
    },
    link: function($scope, element, attrs) {
        $scope.$watchGroup(["labels", "values"],function(newValues ,oldValues) {
          var labels = newValues[0];
          var values = newValues[1];
      },true);
     },
    controller: function($scope) {
    }
  };
});
