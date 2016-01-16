angular.module('pushbudget').controller('budgetSetupCtrl', function($scope) {

  //  dummy data



  $scope.totalSpent = 0;

  // $scope.data = [300, 500, 100, 1500, 230, 56, 678];
  // /dummy data

  $scope.inputs= {};
  $scope.unallocated = 0;


  var labelsArr = ['Unallocated', 'Savings'];
  var total = 0;
  var unallocated = 0;
  var savings = 0;

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal'], function(res) {
   if(res) {
     if(res[0]){
       total = parseFloat(res[0]);
     }else total = undefined; //this will make the chart go away, in this case we need something telling the user to enter a total
     if (res[1]){ //dont include savings if it is undefined (eg, the user declined to enter a value)
      savings = parseFloat(res[1]);
    }else savings = 0;
    unallocated = total - (savings ); //in the parenthesis needs to be a fn that will loop through the total of all budgets + savings and return the sum
    if (unallocated < 0){
      unallocated = undefined; //this will make the chart go away, in this case we need to display something else signifiying that the user is overbudget
    }
    console.log(total, unallocated, savings);
    $scope.data = [savings, unallocated];
    $scope.labels = labelsArr;
   }
 });

 //initial values for pie chart:
 $scope.labels = [];
 $scope.data = [$scope.stuff,20];

  $scope.onClick = function (points, evt) {
    // console.log("evt:", evt);
    // console.log("points:", points);
    // console.log("Label: ", points[0].label, " Value: ", points[0].value);
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
