angular.module('pushbudget').controller('homeCtrl', function($scope, userRef, transactionService) {

  $scope.remaining = parseFloat($scope.user.remaining).toFixed(2);

  $scope.getUntagged = function(){
    transactionService.getAllUserUntagged(userRef._id).then(function(transactions){
    });
  };
  $scope.getUntagged();
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
    // console.log(pct);
    return {width: pct};
  };

  $scope.getDecimals = function(int){
    return parseFloat(int).toFixed(2);
  };

  $scope.getDifference = function(spent, total){
    return parseFloat(total - spent).toFixed(2);
  };

  $scope.getPctSpent = function(spent, total){
    if (total === 0){
      return parseFloat(0).toFixed(2);
    }
    else return parseFloat(((spent/total)*100)).toFixed(2);

    return pct;
  };

  $scope.getPctRemain = function(spent, total){
    if (total === 0){
      return parseFloat(0).toFixed(2);
    }
    else return parseFloat(((1-spent/total)*100)).toFixed(2);
  };

  $scope.setWidth = function(subbudget){
    var sum = subbudget.sum;

    if(sum  >subbudget.allocated || subbudget.allocated <= 0 || isNaN(sum)){
      return {width: '0%'};
    }
    var pct = ((1 - sum/subbudget.allocated)*100).toString() + '%';
    return {width: pct};
   };


});
