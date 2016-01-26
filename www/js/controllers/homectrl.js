angular.module('pushbudget').controller('homeCtrl', function($scope, userRef, transactionService) {

  $scope.remaining = parseFloat($scope.user.remaining).toFixed(2);

  $scope.getUntagged = function(){
    transactionService.getAllUserUntagged(userRef._id).then(function(transactions){
    })
  }
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
  }


})
