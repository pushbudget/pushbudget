angular.module('pushbudget').controller('budgetSetupCtrl', function($scope, $ionicPopup, $ionicModal, $state, chartService) {

  var user = $scope.user;

  var currentSettings = {
    budget: user.totalBudget,
    savings: user.savings,
    categories: user.subbudgetArr.slice(),
    // totalAllocated: user.totalAllocated,
  };

  $scope.deletedCats = [];
  $scope.inputs= {};
  $scope.totalSpent = user.totalSpent;
  $scope.inputs.totalBudget = currentSettings.budget;
  $scope.inputs.savingsGoal = currentSettings.savings;
  $scope.budgetCategories = currentSettings.categories.slice();
  $scope.unallocated = parseFloat(user.unallocated).toFixed(2);

  var categories = currentSettings.categories;

  var initGroup = [
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


  $scope.goodData = true;
  $scope.chart = {};
  $scope.chart.colors = [];
  $scope.chart.labels = [];
  $scope.chart.values = [];
  var chartOptions = {
    //String - Template string for single tooltips
    tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
    //String - Template string for multiple tooltips
    //multiTooltipTemplate: "<%= value + ' %' %>"
    animation: user.userOptions.animateChart,
  };

  $scope.chart.options = chartOptions;


  var chartColorsArr = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#86c8a1', '#4D5360']; //pre-defined colors for the chart. Add more here if you want specific ones to show up before random colors are generated
  var colorCount = categories.length; // we will incrment this color every time a new budget is added and this will be the index of the chartColorsArr that is passed into the budget directive
  var getRandomRGB = function () {
    var rand = Math.floor(Math.random() * (256)).toString(16);
    if (rand.length < 2){
      rand = '0' + rand;
    }
    return rand;
  };
  var getRandomColor = function(){
    var r = getRandomRGB();
    var g = getRandomRGB();
    var b = getRandomRGB();
    var color = '#' + r + g + b;
    return color;
  };
  var getColor = function(){
    if (colorCount <= chartColorsArr.length-1){
      return chartColorsArr[colorCount];
    }else{
      console.log('rand color');
      return getRandomColor(); //if we are out of pre-defined colors, provide a random color
    }
  };

  var updateChart = function(dataObj){
    $scope.chart.values = dataObj.values;
    $scope.chart.labels = dataObj.labels;
    $scope.chart.colors = dataObj.colors;
  };

  $scope.$watch('budgetCategories', function(newValue, oldValue){
    var updated = chartService.budgetUpdate(newValue, $scope.inputs.totalBudget, $scope.inputs.savingsGoal);
    console.log('updatedobj:', updated);
    updateChart(updated.chart);
    $scope.goodData = updated.goodData;
    $scope.savingsOverBudget = updated.savingsOverBudget;
    $scope.overBudgetAmt = updated.overBudgetAmt; //parse float?
    $scope.unallocated = updated.unallocated;
  }, true);

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal'], function(res, prevRes) {
    if(res) {
      if (isNaN(parseFloat(res[1])) || (res[1]) < 0){
        $scope.savingsAmt = 0;
      }else $scope.savingsAmt = parseFloat(res[1]);
      if (parseFloat(res[0]) > 0){
        $scope.noBudget = false;
      }else $scope.noBudget = true;
    //  budgetUpdate();
    }
  });

  $scope.$watch('userOptions.animateChart', function(newVal){
    chartOptions.animation = newVal;
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

  // $scope.onClick = function (points, evt) {
  //   // console.log("evt:", evt);
  //   // console.log("points:", points);
  //   // console.log("Label: ", points[0].label, " Value: ", points[0].value);
  // };

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
          allocated: parseFloat(res.newPrice).toFixed(2),
          category: res.newName,
          color: getColor(),
          new: true,
          totalDisplay: String(parseFloat(res.newPrice).toFixed(2)),
          goodData: true,
        };
        categories.push(output); //add the new category to the category array
        $scope.budgetCategories.push(output);
        budgetUpdate();
        $scope.catId++; //increment the id for the next one
        colorCount++;
      }
    });
  };

  var saveConfirmPopup = function() {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<div ng-repeat="category in deletedCats" style="text-align: center; width:100%">{{category.category}}</div>',
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
    console.log(categories);
    console.log($scope.budgetCategories);
    console.log(idx);
    categories.splice(idx,1);
    $scope.budgetCategories.splice(idx,1);
  };

  $scope.changeColor = function(item){
    item.newColor = getRandomColor();
  };

  $scope.saveEdit = function(item){
    item.category = item.newName;
    item.color = item.newColor;

    item.goodData = true;
    console.log(item.newTotal, item.allocated);
    var inputNum = parseFloat(item.newTotal).toFixed(2);
    if (!isNaN(inputNum) && (inputNum - item.allocated) <= parseFloat($scope.unallocated)){
      item.allocated= item.newTotal;
      item.totalDisplay = String(parseFloat(item.allocated).toFixed(2));
    }else
    {
      item.goodData = false;
    }
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
    for (var i = 0; i < categories.length; i ++){
      categories[i].newTotal = parseFloat(categories[i].allocated).toFixed(2);
      categories[i].totalDisplay = String(parseFloat(categories[i].allocated).toFixed(2));
    }
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
