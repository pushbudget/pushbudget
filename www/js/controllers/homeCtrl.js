angular.module('pushbudget').controller('homeCtrl', function($scope, userRef) {

  $scope.getUntagged = function(){
    transactionService.getAllUserUntagged(userRef._id).then(function(transactions){
      console.log(transactions);
    })
  }
  $scope.getUntagged();

})