angular.module('pushbudget').service('chartService', function () {

  var that = this;
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

  this.getColor = function(colorCount){
    //pre-defined colors for the chart. New categories will be assigned a color from this array in order, afterwhich random colors will be generated. Add more colors here if you want specific ones to show up before random colors are used:
    var chartColorsArr = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#86c8a1', '#4D5360'];

    if (colorCount <= chartColorsArr.length-1){
      return chartColorsArr[colorCount];
    }else{
      return that.getRandomColor(); //if we are out of pre-defined colors, provide a random color
    }
  };



  this.findIndex = function(arr, id){
    for (var i = 0; i < arr.length; i++){
      if (arr[i]._id === id){
        return i;
      }
    }
    return false; //something is broken
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
        if (!initGroupArr[i].allocated){
          initGroupArr[i].allocated  = 0;
        }
        chartValues.push(initGroupArr[i].allocated);
        chartLabels.push(initGroupArr[i].category);
        chartColors.push(initGroupArr[i].color);
      }
      for (i = 0; i < categoriesArr.length; i++){
        if (!categoriesArr[i].allocated){
          categoriesArr[i].allocated = 0;
        }
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
      totalAllocated: newSum,
      goodData: goodData,
      savingsOverBudget: savingsOverBudget,
      overBudgetAmt: overBudgetAmt,
      unallocated: newUnallocated,
    };
    return output;
  };

  this.spendingChartUpdate = function(budgets, untagged, remaining, savings){
    if (remaining < 0){
      remaining = 0;
    }
    var initGroup = [
      {
        category: 'Savings',
        allocated: savings,
        color: '#97BBCD'
      },
      {
        category: 'Remaining',
        allocated: remaining,
        color: '#DCDCDC'
      },
      {
        category: 'Untagged Transactions',
        allocated: untagged,
        color: '#666666'
      },
    ];

    var chartValues = [];
    var chartLabels = [];
    var chartColors = [];

    for (var i = 0; i < initGroup.length; i++ ){
      if (!initGroup[i].allocated){
        initGroup[i].allocated  = 0;
      }
      chartValues.push(parseFloat(initGroup[i].allocated));
      chartLabels.push(initGroup[i].category);
      chartColors.push(initGroup[i].color);
    }
    for (i = 0; i < budgets.length; i++){
      if (!budgets[i].sum){
        budgets[i].sum = 0;
      }
      chartValues.push(parseFloat(budgets[i].sum));
      chartLabels.push(budgets[i].category);
      chartColors.push(budgets[i].color);
    }

    var output = {
      values: chartValues,
      labels: chartLabels,
      colors: chartColors,
    };
    return output;
  };

});
