angular.module('pushbudget').controller('budgetCtrl', function($scope) {

  $scope.labels = ["Entertainment", "Groceries", "Gas", "Rent", "Student Loan", "Water", "Electricity"];
  $scope.data = [300, 500, 100, 1500, 230, 56, 678];

  $scope.onClick = function (points, evt) {
    console.log("evt:", evt);
    console.log("points:", points);
    console.log("Label: ", points[0].label, " Value: ", points[0].value);
    //var activePoints = myRadar.getElementsAtEvent(evt);
  };
});
