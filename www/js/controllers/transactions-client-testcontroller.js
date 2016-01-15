angular.module('pushbudget').controller('transactionTest', function ($scope, transactionService) {

  // test variables
  var user = '5696bdade4b07f04a7491c6f';
  var trans = '56978a2478f86e102af85bab';

  $scope.getAllUserTransactions = function (userId) {
    transactionService.getAllUserTransactions(userId).then(function (res) {
      console.log(res);
      console.log(res.data);
    })
  }

  $scope.getSpecificUserTransaction = function (transId) {
    transactionService.getSpecificUserTransaction(transId).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  var editedTransaction = {
    name: 'kmart'
  }

  // edit specific transaction, pass in an object like editedTransaction above this comment
  $scope.editSpecificUserTransaction = function (transId) {
    transactionService.editSpecificUserTransaction(transId, editedTransaction).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  $scope.deleteSpecificUserTransaction = function (transId) {
    transactionService.deleteSpecificUserTransaction(transId).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  $scope.getAllUserUntagged = function (userId) {
    transactionService.getAllUserUntagged(userId).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  //TEST SERVICE HTTP CALLS FOR EACH

  /* $scope.getAllUserTransactions(user);*/ //WORKING
  /*$scope.getSpecificUserTransaction(trans);*/ //WORKING
  /*$scope.editSpecificUserTransaction(trans, editedTransaction)*/ //WORKING
  /*$scope.deleteSpecificUserTransaction('56978a2478f86e102af85ba9');*/ //WORKING
  /*$scope.getAllUserUntagged(user);*/
});