angular.module('pushbudget').controller('mainCtrl', function ($scope, $state, $location, userService, userRef, transactionService) {

  //replace this later with a ref to the user which will be aquired during initial splash screen load
  // userService.getUserFromDb('5696bd87e4b07f04a7491c6b').then(function (res) {
  //   $scope.currentUser = res.data;
  //   console.log($scope.currentUser);
  // });
  $scope.currentUser = userRef;
  var budget = userRef.budget;
  $scope.totalUserBudget = parseFloat(budget.amount).toFixed(2);
  $scope.totalUserSpent = 0; //budget.spent; **********change this once its implemented on the backend!!
  $scope.totalUserSavings = 0;
  $scope.totalUserRemain = parseFloat($scope.totalUserBudget - $scope.totalUserSpent).toFixed(2);
  $scope.userSubBudgets = budget.subbudgets;

  $scope.userEmail = userRef.email;


  console.log('userRef', userRef);

  transactionService.getAllUserTransactions(userRef._id).then(function (res) {
    console.log(res);
    $scope.transactions = res;
  });

  // $scope.updateUser = function (args) {
  //   //stuff
  //   userService.getUserFromDb().then(function (res) {
  //     $scope.currentUser = res.data;
  //   })
  // };

  $scope.$on('logout', function () {
    console.log('REALLY TRYING TO LOGOUT NOW');
    $state.go('login');
  });

});
