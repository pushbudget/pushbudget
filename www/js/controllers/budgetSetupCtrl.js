angular.module('pushbudget').controller('budgetSetupCtrl', function($scope) {



  $scope.labels = ["Entertainment", "Groceries", "Gas", "Rent", "Student Loan", "Water", "Electricity"];
  $scope.data = [300, 500, 100, 1500, 230, 56, 678];

  $scope.onClick = function (points, evt) {
    console.log("evt:", evt);
    console.log("points:", points);
    console.log("Label: ", points[0].label, " Value: ", points[0].value);
  };


  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };


});
