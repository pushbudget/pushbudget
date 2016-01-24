angular.module('pushbudget').service('chartService', function () {

  var getRandomRGB = function () {
    var rand = Math.floor(Math.random() * (256)).toString(16);
    if (rand.length < 2){
      rand = '0' + rand;
    }
    return rand;
  };

  this.getRandomColor = function(){
    var r = getRandomRGB();
    var g = getRandomRGB();
    var b = getRandomRGB();
    var color = '#' + r + g + b;
    return color;
  };

  this.inputValidate = function(inputArr){
    var total = parseFloat(inputArr[0]);
    var savings = parseFloat(inputArr[1]);
    var savingsAmt = savings;
    var noBudget = true;
    if (isNaN(savings) || savings < 0){
      savingsAmt = 0;
    }
    if (parseFloat(total) > 0){
      noBudget = false;
    }
    return {
      savingsAmt: savingsAmt,
      noBudget: noBudget
    };
  };

  this.budgetUpdate = function(categoriesArr, totalBudget, savingsGoal){
    currentTotal = parseFloat(totalBudget);
    currentSavings = parseFloat(savingsGoal);
    var goodData = true;
    var savingsOverBudget = false;
    var deficit = 0;
    var newSum = 0;
    var overBudgetSavings;
    var overBudgetAmt;
    var newUnallocated;
    var chartValues = [];
    var chartLabels = [];
    var chartColors = [];
    var initGroupArr = [
      {
        category: 'Savings',
        allocated: 0,
        color: '#97BBCD'
      },
      {
        category: 'Unbudgeted',
        allocated: 0,
        color: '#DCDCDC'
      }
    ];

    //update budgets:
    for (var i = 0; i <categoriesArr.length;i++){
      newSum += parseFloat(categoriesArr[i].allocated);
    }
    if (isNaN(currentTotal) || currentTotal <=0){
      currentTotal = 0;
    }
    if (isNaN(currentSavings) || currentSavings < 0){
      currentSavings = 0;
    }
    if (newSum + currentSavings > currentTotal){
      goodData = false;
      deficit = (currentTotal - (newSum + currentSavings))*-1;
      overBudgetSavings = currentSavings;
      currentSavings = currentTotal - newSum;
      savingsOverBudget = true;
      overBudgetAmt = parseFloat(overBudgetSavings - currentSavings).toFixed(2);
    }
    newUnallocated = currentTotal - currentSavings - newSum;
    if (newUnallocated < 0){
      goodData = false;
      newUnallocated = 0;
    }
    initGroupArr[0].allocated = currentSavings;
    initGroupArr[1].allocated = newUnallocated;

    //update chart
    if (deficit > 0){
      chartValues.push(deficit);
      chartLabels.push('Over Budget');
      chartColors.push('#ef4e3a');
    }else{
      for (i = 0; i < initGroupArr.length; i++ ){
        chartValues.push(initGroupArr[i].allocated);
        chartLabels.push(initGroupArr[i].category);
        chartColors.push(initGroupArr[i].color);
      }
      for (i = 0; i < categoriesArr.length; i++){
        chartValues.push(parseFloat(categoriesArr[i].allocated));
        chartLabels.push(categoriesArr[i].category);
        chartColors.push(categoriesArr[i].color);
      }
    }

    var output = {
      chart:{
        values: chartValues.slice(),
        labels: chartLabels.slice(),
        colors: chartColors.slice(),
      },
      goodData: goodData,
      savingsOverBudget: savingsOverBudget,
      overBudgetAmt: overBudgetAmt,
      unallocated: newUnallocated,
    };
    return output;
  };

});
