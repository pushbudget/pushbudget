angular.module('pushbudget').controller('budgetCtrl', function($scope) {
  console.log('go');

  var user = $scope.user;
  var totalBudget = $scope.totalUserBudget;
  $scope.totalUserSavings = parseFloat($scope.totalUserSavings).toFixed(2);
  var savings = $scope.totalUserSavings;
  var budgets = $scope.userSubBudgets;
  var spent = $scope.totalUserSpent;
  //$scope.totalUntagged = parseFloat($scope.totalUntagged).toFixed(2);
  var untagged = $scope.totalUntagged;
  $scope.totalUntagged = parseFloat($scope.totalUntagged).toFixed(2);
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
    animation: user.userOptions.animateChart,
  };
  $scope.chart.options = chartOptions;

  $scope.$watch('userOptions.animateChart', function(newVal){
    chartOptions.animation = newVal;
  });

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

  var chartUpdate = function(){
    var chartValues = [];
    var chartLabels = [];
    var chartColors = [];

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
  };


  $scope.getDecimals = function(int){
    return parseFloat(int).toFixed(2);
  };

  $scope.getDifference = function(spent, total){
    return parseFloat(total - spent).toFixed(2);
  };

  $scope.getPctSpent = function(spent, total){
    return parseFloat(((spent/total)*100)).toFixed(2);
  };

  $scope.getPctRemain = function(spent, total){
    return parseFloat(((1-spent/total)*100)).toFixed(2);
  };

  $scope.setWidth = function(subbudget){
    var sum = subbudget.sum;

    if(sum  >subbudget.allocated){
      return {width: '0%'};
    }
    var pct = ((1 - sum/subbudget.allocated)*100).toString() + '%';
    return {width: pct};
   };

});
