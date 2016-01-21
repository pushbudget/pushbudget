angular.module('pushbudget').controller('budgetSetupCtrl', function($scope, $ionicPopup, $ionicModal, $state) {

  //hook these init values up to the user data from the backend:
  var initBudget = 0;
  var initSavings = 0;
  var initSpent = 0;
  var initCats = [
    //dummy data for testing:
    // {
    //   color: '#F7464A',
    //   id: 432,
    //   name: 'cat 1',
    //   total: '10'
    // },
    // {
    //   color: '#46BFBD',
    //   id: 143,
    //   name: 'cat 2',
    //   total: '5',
    // },
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

  $scope.deletedCats = [];
  $scope.inputs= {};
  $scope.totalSpent = initSpent;
  $scope.inputs.totalBudget = initBudget;
  var categories = initCats.slice();
  $scope.budgetCategories = categories.slice();
  var savings = initSavings;
  var budgetSum = 0;

  for (var j = 0; j < categories.length; j++){
    budgetSum += categories[j].total;
  }
  var unallocated = parseFloat($scope.inputs.totalBudget) - savings - budgetSum;
  $scope.unallocated = parseFloat(unallocated).toFixed(2);

  var initGroup = [
    {
      name: 'Savings',
      total: 0,
      color: '#97BBCD'
    },
    {
      name: 'Unbudgeted',
      total: 0,
      color: '#DCDCDC'
    }
  ];
  var updateInitGroup = function(savings, unallocated){
    initGroup[0].total = savings;
    initGroup[1].total = unallocated;
  };
  updateInitGroup(savings, unallocated);

  $scope.goodData = true;
  $scope.chart = {};
  $scope.chart.colors = [];
  $scope.chart.labels = [];
  $scope.chart.values = [];
  chartOptions = {
    //String - Template string for single tooltips
    tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
    //String - Template string for multiple tooltips
    //multiTooltipTemplate: "<%= value + ' %' %>"
    // animation: false,
  };
  $scope.chart.options = chartOptions;
  var chartColorsArr = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#86c8a1', '#4D5360']; //pre-defined colors for the chart. Add more here if you want specific ones to show up before random colors are generated
  var colorCount = categories.length; // we will incrment this color every time a new budget is added and this will be the index of the chartColorsArr that is passed into the budget directive
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var getRandomColor = function(){
    var color = '#' + getRandomInt(0, 255).toString(16) + getRandomInt(0, 255).toString(16) + getRandomInt(0, 255).toString(16);
    return color;
  };
  var getColor = function(){
    if (colorCount <= chartColorsArr.length-1){
      console.log(chartColorsArr[colorCount]);
      console.log(chartColorsArr);
      return chartColorsArr[colorCount];
    }else{
      console.log('rand color');
      return getRandomColor(); //if we are out of pre-defined colors, provide a random color
    }
  };

  var chartUpdate = function(){
    //used for chart (chart takes two seperate arrays of data that we have to split)
    var chartValues = [];  //array of values for categories
    var chartLabels = [];  //array of labels for categories
    var chartColors = [];  //array of colors for categories
    for (var i = 0; i < initGroup.length; i++ ){
      chartValues.push(parseFloat(initGroup[i].total));
      chartLabels.push(initGroup[i].name);
      chartColors.push(initGroup[i].color);
    }
    for (i = 0; i < categories.length; i++){
      chartValues.push(parseFloat(categories[i].total));
      chartLabels.push(categories[i].name);
      chartColors.push(categories[i].color);
    }
    $scope.chart.values = chartValues.slice();
    $scope.chart.labels = chartLabels.slice();
    $scope.chart.colors = chartColors.slice();

    //console.log('chart values:', chartValues);
  };

  var budgetUpdate = function(){
    $scope.goodData = true;
    $scope.savingsOverBudget = false;
    var newSum = 0;
    for (var i = 0; i < categories.length; i ++){
      newSum += parseFloat(categories[i].total);
    }
    var currentTotal = parseFloat($scope.inputs.totalBudget);
    if (isNaN(currentTotal) || currentTotal <=0){
      currentTotal = 1; //must have at least 1 to have the chart showup
    }
    var currentSavings = parseFloat($scope.inputs.savingsGoal);
    if (isNaN(currentSavings) || currentSavings < 0){
      currentSavings = 0;
    }
    if (newSum + currentSavings > currentTotal){
      $scope.goodData = false;
      var overBudgetSavings = currentSavings;
      currentSavings = currentTotal - newSum;
      $scope.savingsOverBudget = true;
      $scope.overBudgetAmt = parseFloat(overBudgetSavings - currentSavings).toFixed(2);
    }

    var newUnallocated = currentTotal - currentSavings - newSum;
    $scope.unallocated = parseFloat(newUnallocated).toFixed(2);
    if (newUnallocated < 0){
      $scope.goodData = false;
      newUnallocated = 0; //the graph uses absolute values, so a negative value causes many problems
    }
    updateInitGroup(currentSavings, newUnallocated);
    chartUpdate();
  };

  $scope.$watch('budgetCategories', function(newValue, oldValue){
    budgetUpdate();
  }, true);

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal'], function(res, prevRes) {
    if(res) {
      if (isNaN(parseFloat(res[1])) || (res[1]) < 0){
        $scope.savingsAmt = 0;
      }else $scope.savingsAmt = parseFloat(res[1]);
      budgetUpdate();
    }
  });


  var findIndex = function(id){
    var arr = $scope.budgetCategories.slice();
    for (var i = 0; i < arr.length; i++){
      if (arr[i].id === id){
        return i;
      }
    }
    return false; //something is broken
  };

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

    var isEmpty = function(obj) {
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop)){
          return false;
        }
      }
      return true;
    };

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
      //if the user did not press cancel:
      if (res){
        res.newPrice = parseFloat(res.newPrice);
        var output = {
          id: $scope.catId,
          total: parseFloat(res.newPrice).toFixed(2),
          name: res.newName,
          color: getColor(),
          new: true,
        };
        categories.push(output); //add the new category to the category array
        $scope.budgetCategories.push(output);
        budgetUpdate();
        chartUpdate();
        $scope.catId++; //increment the id for the next one
        colorCount++;
      }
    });
  };

  var saveConfirmPopup = function() {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<div ng-repeat="category in deletedCats" style="text-align: center; width:100%">{{category.name}}</div>',
      title: 'Save Changes?',
      subTitle: $scope.deletedCats.length + ' existing categories will be deleted:',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          type: 'button-positive'
        },
        {
          text: 'Delete',
          onTap: function(e) {
            $scope.data.ok = true;
            return $scope.data;
          }
        }
      ]
    });

    //after the popup is closed, this will happen:
    myPopup.then(function(res) {
      //if the user did not press cancel:
      if (res){
        writeChangesToDb();
        $state.go('main.budgets');
      }
    });
  };

  var writeChangesToDb = function(){
    console.log('savings to db!');
    //code here to do stuff to the database *************************************************

  };

  $scope.save = function(){
    if ($scope.deletedCats.length > 0){
      saveConfirmPopup();
    }else{
      writeChangesToDb();
      $state.go('main.budgets');
    }
  };

  $scope.cancel = function(){
    //reset all values to initial states:
    $scope.deletedCats = [];
    $scope.inputs= {};
    $scope.totalSpent = initSpent;
    $scope.inputs.totalBudget = initBudget;
    categories = initCats.slice();
    $scope.budgetCategories = categories.slice();
    savings = initSavings;
    budgetSum = 0;
    unallocated = 0;
    $state.go('main.budgets');
  };

  $scope.showDelete = false;
  $scope.showReorder = false;
  $scope.listCanSwipe = true;

  $scope.deleteCategory = function(item){
    var idx = findIndex(item.id);
    if (!item.new){
      $scope.deletedCats.push(item);
    }
    categories.splice(idx,1);
    $scope.budgetCategories.splice(idx,1);
  };

  $scope.changeColor = function(item){
    item.color = getRandomColor();
  };
  $scope.stuff = function(){
    console.log('stuff');
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.budgetCategories.splice(fromIndex, 1);
    $scope.budgetCategories.splice(toIndex, 0, item);
    categories.splice(fromIndex, 1);
    categories.splice(toIndex, 0 , item);
  };

  $ionicModal.fromTemplateUrl('templates/budgetsetup-edit.html', {
  scope: $scope,
  animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
  $scope.modal.remove();
  });
  // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
  // Execute action
  });
  // Execute action on remove modal
    $scope.$on('modal.removed', function() {
  // Execute action
  });

});
