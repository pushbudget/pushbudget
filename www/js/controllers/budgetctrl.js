angular.module('pushbudget').controller('budgetCtrl', function($scope) {

  var totalBudget = $scope.totalUserBudget;
  $scope.totalUserSavings = parseFloat($scope.totalUserSavings).toFixed(2);
  var savings = $scope.totalUserSavings;
  var budgets = $scope.userSubBudgets;
  var spent = $scope.totalUserSpent;
  //$scope.totalUntagged = parseFloat($scope.totalUntagged).toFixed(2);
  var untagged = $scope.totalUntagged;
  var remaining = $scope.totalUserRemain;
  if (remaining < 0){
    remaining = 0;
  }

  $scope.chart = {};

  var chartOptions = {
    //String - Template string for single tooltips
    tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
    //String - Template string for multiple tooltips
    //multiTooltipTemplate: "<%= value + ' %' %>"
    animation: $scope.userOptions.animateChart,
  };
  $scope.chart.options = chartOptions;

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

    //used for chart (chart takes two seperate arrays of data that we have to split)
    var chartValues = [];  //array of values for categories
    var chartLabels = [];  //array of labels for categories
    var chartColors = [];  //array of colors for categories

    for (var i = 0; i < initGroup.length; i++ ){
      chartValues.push(parseFloat(initGroup[i].allocated));
      chartLabels.push(initGroup[i].category);
      chartColors.push(initGroup[i].color);
    }
    for (i = 0; i < budgets.length; i++){
      chartValues.push(parseFloat(budgets[i].sum));
      chartLabels.push(budgets[i].category);
      chartColors.push(budgets[i].color);
    }

    $scope.chart.values = chartValues.slice();
    $scope.chart.labels = chartLabels.slice();
    $scope.chart.colors = chartColors.slice();





  $scope.setWidth = function(subbudget){
    var sum = subbudget.sum;

    if(sum  >subbudget.allocated){
      return {width: '0%'};
    }
    var pct = ((1 - sum/subbudget.allocated)*100).toString() + '%';
    return {width: pct};
   };

});
