angular.module('pushbudget').controller('transCtrl', function ($scope) {



  var allCategories = [{
    transactions: $scope.user.untaggedArr,
    category: 'Untagged'
  }];
  for (var i = 0; i < $scope.user.subbudgetArr.length; i++){
    allCategories.push($scope.user.subbudgetArr[i]);
  }

  $scope.allCategories = allCategories;
  $scope.selectedSub = $scope.allCategories[0];

});
