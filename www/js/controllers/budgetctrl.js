angular.module('pushbudget').controller('budgetCtrl', function($scope) {

  $scope.labels = ["Entertainment", "Groceries", "Gas", "Rent", "Student Loan", "Water", "Electricity"];
  $scope.data = [300, 500, 100, 1500, 230, 56, 678];

  $scope.onClick = function (points, evt) {
    console.log("evt:", evt);
    console.log("points:", points);
    console.log("Label: ", points[0].label, " Value: ", points[0].value);
    //var activePoints = myRadar.getElementsAtEvent(evt);
  };

  $scope.setWidth = function(subbudget){
    // console.log(subbudget);
    var totalSpent = 0;
    for(var i = 0; i < subbudget.transactions.length; i++){
      totalSpent += subbudget.transactions[i].amount;
    }
    if(totalSpent>subbudget.allocated){
      return {width: '0%'};
    }
    var pct = ((1 - totalSpent/subbudget.allocated)*100).toString() + '%';
    console.log(pct);
    return {width: pct};
  }

});
