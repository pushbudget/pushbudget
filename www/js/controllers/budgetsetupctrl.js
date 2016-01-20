angular.module('pushbudget').controller('budgetSetupCtrl', function($scope, $ionicPopup) {

  // TODO:
  //
  // -need to find a way to assign a new category a color, and then map that color onto the pie chart
  // -right now there is not really any checking for good/bad data on new category input. need to ensure that only a number is entered into the ammount field, and not let the use click ok until that has happened. Also need to make sure that the user has entered a name as well before allowing the ok button to be enabled
  // -right now if a user clicks cancel on the new category popup, it still tries to add it to the array with undefined values.
  // -need to add the ability to easily delete a category (swipe to delete like on newaction detail page?)
  // -maybe make clicking a category on the setup page bring up the popup to edit it?
  // -possibly add a way for the user to choose a color for the category, right now the graph library automatically assigns the first 7 then after that chooses random colors.
  // -right now a hard-coded "spent" ammount is being sent to the budgetcat directive, this will later need to be replaced with the data we get from the db, which im thinking we should put on a ref that gets passed in from the resolve block in the router
  // -we also need to make sure that a user is not adding a category with a budget ammount that exceeds the total that is unallocated
  // -it would be cool if there were sliders somewhere where a user could do on-the-fly adjustments of the ammounts of each sub-budget and see how that dynamically affects the pie chart. maybe the edit functionality of each category would bring a drop-down div out from under it to show the slider?
  // - weird stuff happens if the user enters negative values for budgets, we need to check for this
  //dummy data ************************************
  var dummyBudget = 100;
  var dummySavings = 0;
  var dummySpent = 0;

  var dummyCats = [
    {
      color: '#F7464A',
      id: 432,
      name: 'tacos',
      total: '10'
    },
    {
      color: '#46BFBD',
      id: 143,
      name: 'pizza',
      total: '5',
    },
    // {
    //   color: '#FDB45C',
    //   id: 4322,
    //   name: 'nachos',
    //   total: '2'
    // },
    // {
    //   color: '#949FB1',
    //   id: 873,
    //   name: 'burgers',
    //   total: '6',
    // },
    // {
    //   color: '#4D5360',
    //   id: 461,
    //   name: 'falafel',
    //   total: '9'
    // }

  ];

  $scope.totalSpent = dummySpent;   //  dummy data

  $scope.inputs= {};
  $scope.inputs.totalBudget = dummyBudget;

  $scope.categoryArr = []; //this is an array of new category objects
  // $scope.categoryArr = dummyCats.slice();
  var existingCats = dummyCats.slice(); //array of passed in categories


  $scope.catId = 0; // unique identifier for each new category box, starts at 0 and increments each time a new category is added.
  $scope.unallocated = 0;
  $scope.chart = {};

  chartOptions = {
      //String - Template string for single tooltips
      tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
      //String - Template string for multiple tooltips
      //multiTooltipTemplate: "<%= value + ' %' %>"
  };

  $scope.chart.options = chartOptions;

  var chartColorsArr = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']; //these are taken from angular-chart.js Chart.defaults.global.colours
  var colorCount = existingCats.length; // we will incrment this color every time a new budget is added and this will be the index of the chartColorsArr that is passed into the budget directive
  var initLabelsArr = ['Savings', 'Unallocated']; //initial labels
  var total = 0;
  var unallocated = 0;
  var savings = 0;

  //used for chart (chart takes two seperate arrays of data that we have to split)
  var chartCatValues = [];  //array of values for categories
  var chartCatLabels = [];  //array of labels for categories
  //populate arrays with passed in values:
  for (var i = 0; i < existingCats.length; i++){
      chartCatValues.push(existingCats[i].total);
      chartCatLabels.push(existingCats[i].name);
  }


  $scope.$watch('catId', function(nextId, thisId){
    if($scope.categoryArr.length > 0){
       console.log('new category added', thisId);
       chartCatValues.push(parseFloat($scope.categoryArr[thisId].total));
       chartCatLabels.push($scope.categoryArr[thisId].name);
     }
     $scope.budgetCategories = existingCats.concat($scope.categoryArr).slice();

  });

  $scope.$watch('budgetCategories', function(newValue, oldValue){
    var updatedValuesArr = [];
    var updatedSum = 0; //sum of all categories
    var updatedUnallocated = 0;
    var savingsGoal = $scope.inputs.savingsGoal;
    //build the array of updated values:
    //the categories that were passed in:
    for (var i = 0; i < existingCats.length; i++){
      updatedSum += parseFloat(existingCats[i].total);
      updatedValuesArr.push(parseFloat(existingCats[i].total));
    }
    //the new ones we have created:
    for (i =0; i< $scope.categoryArr.length; i++){
      updatedSum += parseFloat($scope.categoryArr[i].total);
      updatedValuesArr.push(parseFloat($scope.categoryArr[i].total));
    }

    if (savingsGoal){
      savingsGoal = parseFloat(savingsGoal);
    }else savingsGoal = 0;

    updatedUnallocated = parseFloat($scope.inputs.totalBudget) - savingsGoal - updatedSum;
    unallocated = updatedUnallocated;
    console.log(unallocated);
    $scope.unallocated = unallocated;

    var initArr = [savingsGoal, updatedUnallocated];
    chartCatValues = updatedValuesArr;
    $scope.chart.values = initArr.concat(chartCatValues);
    console.log($scope.chart.values);
    console.log('slider:', chartCatValues);
    $scope.budgetCategories = existingCats.concat($scope.categoryArr).slice();



  }, true);

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal', 'catId'], function(res, prevRes) {
    if(res) {
      var totalBudget = res[0];
      var savingsGoal = res[1];
      var catId = prevRes[2]; //the last catId to be added
      var nextCatId = res[2];
      var valuesSum = 0;

      for (var i = 0; i < chartCatValues.length; i++){
        valuesSum += chartCatValues[i];
      }
      console.log('valuesSum', valuesSum);
      
      $scope.goodData = false;
      if(!isNaN(totalBudget) && totalBudget > 0){
        total = parseFloat(totalBudget);
        $scope.goodData = true;
        $scope.totalBudget = totalBudget;
      }else{
        total = 1; //a default value of 1 shows a blank chart, 0 shows no chart
      }
      console.log('total:',total);

      //dont include savings if it is undefined (eg, the user declined to enter a value)
      if (savingsGoal){
        savings = parseFloat(savingsGoal);
      }else savings = 0;

      console.log(savings, valuesSum);
      unallocated = total - (savings + valuesSum); //in the parenthesis needs to be a fn that will loop through the total of all budgets + savings and return the sum
      if (unallocated < 0){
        unallocated = undefined; //this will make the chart go away, in this case we need to display something else signifiying that the user is overbudget. Otherwise the chart seems to just take absolute values of negative numbers and the result is a mess
      }
      console.log('unallocated:', unallocated);

      if(totalBudget){
        $scope.unallocated = parseFloat(unallocated).toFixed(2);
      } else $scope.unallocated = undefined;

      $scope.chart.values = [savings, unallocated]; //array of chart values, the first two will always be the savings ammount and the unallocated ammount.
      $scope.chart.values = $scope.chart.values.concat(chartCatValues); //add the array of categories
      $scope.chart.labels = initLabelsArr.concat(chartCatLabels); //add array of labels (initial labels + category labels)

    }
  });


 //initial values for pie chart:
 $scope.chart.labels = [];
 $scope.chart.values = [];

  $scope.onClick = function (points, evt) {
    // console.log("evt:", evt);
    // console.log("points:", points);
    // console.log("Label: ", points[0].label, " Value: ", points[0].value);
  };


  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    console.log('popup!');
    return $scope.shownGroup === group;
  };

  $scope.addCatPopup = function() {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/budgetsetup-addcat.html',
      title: 'Add A New Category',
      subTitle: '$'+ $scope.unallocated +' remain',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.newPrice || !$scope.data.newName || parseFloat($scope.data.newPrice) > $scope.unallocated || isNaN($scope.data.newPrice) || parseFloat($scope.data.newPrice) <=0) {
              //don't allow the user to close unless they enters a new price and name. Also check that this budget does not exceed funds remaining and that it is a number > 0
              e.preventDefault();
            } else {
              return $scope.data;
            }
          }
        }
      ]
    });

    //after the popup is closed, this will happen:
    myPopup.then(function(res) {
      res.newPrice = parseFloat(res.newPrice);
      //if the user did not press cancel:
      if (res){
        var output = {
          id: $scope.catId,
          total: parseFloat(res.newPrice).toFixed(2),
          name: res.newName,
          color: chartColorsArr[colorCount],
        };
        $scope.categoryArr.push(output); //add the new category to the category array
        $scope.catId++; //increment the id for the next one
        colorCount++;
        console.log($scope.categoryArr);
      }
    });
  };


});
