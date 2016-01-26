angular.module('pushbudget').controller('mainCtrl', function ($scope, $state, $location, userRef, transactionService, untaggedRef, userDataService) {
//  $scope.$on()
  console.log('I AM MAIN');
//  console.log('userRef from main:', userRef);
  $scope.user = userDataService.getUserData(userRef, untaggedRef);
//  console.log('scope.user', $scope.user);
  $scope.updateUser = function(){
    $scope.user = userDataService.getUserData(userRef, untaggedRef);
  };


  //replace this later with a ref to the user which will be aquired during initial splash screen load
  // userService.getUserFromDb('5696bd87e4b07f04a7491c6b').then(function (res) {
  //   $scope.currentUser = res.data;
  //   console.log($scope.currentUser);
  // });
  // $scope.currentUser = userRef;
  // $scope.userUntagged = untaggedRef;
  // console.log(untaggedRef);
  // console.log('userRef:',userRef);
  // var budget = userRef.budget;
  // budget.savings = 0; //change this;
  // $scope.totalUserBudget = parseFloat(budget.amount).toFixed(2);
  // $scope.useableBudget = parseFloat(budget.amount - budget.savings).toFixed(2);
  // console.log(budget);
  //
  //
  //
  // $scope.userOptions = {};
  // $scope.userOptions.animateChart = false;
  //
  // $scope.userEmail = userRef.email;
  //
  // //calculate sums:
  // $scope.calcuateSubBudgetSums = function(budgets){
  //   return calcService.calcSums(budgets);
  // };
  // $scope.calculateUntaggedSum = function(arr){
  //   return calcService.calcUntaggedSum(arr);
  // };
  //
  // //get the sums:
  // var sumObj = calcService.calcSums(budget.subbudgets);
  // var untaggedSum = calcService.calcUntaggedSum(untaggedRef);
  // $scope.totalUntagged = untaggedSum;
  // $scope.userSubBudgets = sumObj.subbudgets;
  // $scope.totalUserSpent = sumObj.totalSum + untaggedSum;
  // $scope.totalUserSavings = budget.savings;
  // console.log($scope.useableBudget, $scope.totalUserSpent);
  // $scope.totalUserRemain = parseFloat(parseFloat($scope.useableBudget) - parseFloat($scope.totalUserSpent)).toFixed(2);



  transactionService.getAllUserTransactions(userRef._id).then(function (res) {
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
