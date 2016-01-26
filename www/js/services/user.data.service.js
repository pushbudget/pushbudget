angular.module('pushbudget').service('userDataService', function () {

  this.getUserData = function(userRef, untaggedRef){
    console.log('userRef:', userRef);
    var calcSums = function(budgetArr){
      var totalSum = 0;
      var totalAllocated = 0;
      for (var i = 0; i < budgetArr.length; i++){
        var sum = 0;
        for (var j = 0; j < budgetArr[i].transactions.length; j++){
          sum += budgetArr[i].transactions[j].amount;
        }
        for (j = 0; j < budgetArr[i].splits.length; j++){
          sum += budgetArr[i].splits[j].amount;
        }
        totalAllocated += budgetArr[i].allocated;
        budgetArr[i].sum = sum;
        totalSum += sum;
        budgetArr[i].goodData = true;
        budgetArr[i].initVal = (budgetArr[i].allocated/userRef.budget.amount)*100;
      }
      return {
        subbudgets: budgetArr,
        totalSum: totalSum,
        totalAllocated: totalAllocated,
      };
    };

    var calcUntaggedSum = function(untaggedArr){
      var sum =0;
      for (var i = 0; i < untaggedArr.length; i++){
        sum += untaggedArr[i].amount;
      }
      return sum;
    };

    var sumObj = calcSums(userRef.budget.subbudgets);
    var untaggedSum = calcUntaggedSum(untaggedRef);

    var userObj = {
      userId: userRef._id,
      budgetId: userRef.budget._id,
      untaggedSum: untaggedSum,
      totalSpent: sumObj.totalSum + untaggedSum,
      totalBudget: userRef.budget.amount,
      totalAllocated: sumObj.totalAllocated,
      unallocated: userRef.budget.amount - userRef.savings - sumObj.totalAllocated,
      savings: userRef.budget.savings,
      subbudgetArr: sumObj.subbudgets.slice(),
      untaggedArr: untaggedRef.slice(),
      useableBudget: userRef.budget.amount - userRef.savings,
      remaining: (userRef.budget.amount - userRef.savings) - (sumObj.totalSum + untaggedSum),
      email: userRef.email,
      userOptions: {
        animateChart: false, //need to make this a property on the db schema
      },
    };
    return userObj;
  };



});
