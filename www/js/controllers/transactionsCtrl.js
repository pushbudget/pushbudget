angular.module('pushbudget').controller('transCtrl', function ($scope, userDataService) {

  $scope.getDecimals = function(int){
    return userDataService.getDecimals(int);
  };

  var allCategories = [{
    transactions: $scope.user.untaggedArr,
    category: 'Untagged'
  }];
  for (var i = 0; i < $scope.user.subbudgetArr.length; i++){
    console.log($scope.user.subbudgetArr[i].transactions);
    console.log(typeof $scope.user.subbudgetArr[i].transactions);

    var combinedArr =  $scope.user.subbudgetArr[i].transactions.slice();
    for (var j = 0 ; j < $scope.user.subbudgetArr[i].splits.length; j++){
      var splitObj = {
        amount: $scope.user.subbudgetArr[i].splits[j].amount,
        name: $scope.user.subbudgetArr[i].splits[j].transaction.name,
        posted: $scope.user.subbudgetArr[i].splits[j].transaction.posted,
        tagged: $scope.user.subbudgetArr[i].splits[j].transaction.tagged,
        _id: $scope.user.subbudgetArr[i].splits[j].transaction._id,
        categoryId:  $scope.user.subbudgetArr[i]._id,
      };
      combinedArr.push(splitObj);
    }
    var combinedObj = {
      transactions: combinedArr,
      category: $scope.user.subbudgetArr[i].category,
    };
    allCategories.push(combinedObj);
  }
  console.log(allCategories);
  $scope.allCategories = allCategories;
  $scope.selectedSub = $scope.allCategories[0];



});
