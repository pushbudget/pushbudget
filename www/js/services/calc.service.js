angular.module('pushbudget').service('calcService', function () {

  //takes in array of sub budgets, returns an object containing the subbudget array with a sum property on each element, and a total sum of all sub budgets
  this.calcSums = function(budgetArr){
    var totalSum = 0;
    for (var i = 0; i < budgetArr.length; i++){
      var sum = 0;
      for (var j = 0; j < budgetArr[i].transactions.length; j++){
        sum += budgetArr[i].transactions[j].amount;
      }
      for (j = 0; j < budgetArr[i].splits.length; j++){
        sum += budgetArr[i].splits[j].amount;
      }
      budgetArr[i].sum = sum;
      totalSum += sum;
    }
    return {
      subbudgets: budgetArr,
      totalSum: totalSum,
    };
  };

  this.calcUntaggedSum = function(untaggedArr){
    var sum =0;
    for (var i = 0; i < untaggedArr.length; i++){
      sum += untaggedArr[i].amount;
    }
    return sum;
  };

});
