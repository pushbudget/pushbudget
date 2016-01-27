angular.module('pushbudget').controller('budgetCtrl', function($scope, chartService, userDataService) {

  $scope.$on('pageRefresh', function(event, args){
    console.log('i (budgetctrl) need to refresh');
    pageLoad();
  });
  var pageLoad = function(){
    var user = $scope.user;
    console.log('budgetctrl load: user:', user);

    var remaining = parseFloat(user.remaining).toFixed(2);
    if (remaining < 0){
      remaining = parseFloat(0).toFixed(2);
    }
    $scope.remaining = remaining;
    $scope.savings = parseFloat(user.savings).toFixed(2);
    $scope.untaggedSum = parseFloat(user.untaggedSum).toFixed(2);
    var totalBudget = user.totalBudget;
    $scope.chart = {};

    var chartOptions = {
      //String - Template string for single tooltips
      tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
      //String - Template string for multiple tooltips
      //multiTooltipTemplate: "<%= value + ' %' %>"
      animation: $scope.userOptions.animateChart,
    };

    $scope.$watch('userOptions.animateChart', function(newVal){
      chartOptions.animation = newVal;
    });

    var chart = chartService.spendingChartUpdate(user.subbudgetArr, user.untaggedSum, user.remaining, user.savings);
    $scope.chart.values = chart.values;
    $scope.chart.labels = chart.labels;
    $scope.chart.colors = chart.colors;
    $scope.chart.options = chartOptions;


    $scope.getDecimals = function(int){
      return parseFloat(int).toFixed(2);
    };

    $scope.getDifference = function(spent, total){
      return parseFloat(total - spent).toFixed(2);
    };

    $scope.getPctSpent = function(spent, total){
      if (total === 0){
        return parseFloat(0).toFixed(2);
      }
      else return parseFloat(((spent/total)*100)).toFixed(2);

      return pct;
    };

    $scope.getPctRemain = function(spent, total){
      if (total === 0){
        return parseFloat(0).toFixed(2);
      }
      else return parseFloat(((1-spent/total)*100)).toFixed(2);
    };

    $scope.setWidth = function(subbudget){
      var sum = subbudget.sum;

      if(sum  >subbudget.allocated || subbudget.allocated <= 0 || isNaN(sum)){
        return {width: '0%'};
      }
      var pct = ((1 - sum/subbudget.allocated)*100).toString() + '%';
      return {width: pct};
     };

     $scope.setWidthSpent = function(subbudget){
       var sum = subbudget.sum;

       if(sum  >subbudget.allocated || subbudget.allocated <= 0 || isNaN(sum)){
         return {width: '0%'};
       }
       var pct = ((sum/subbudget.allocated)*100).toString() + '%';
       return {width: pct};
      };

  };
  pageLoad();

});
