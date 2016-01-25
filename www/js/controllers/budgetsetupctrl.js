angular.module('pushbudget').controller('budgetSetupCtrl', function($scope, $ionicPopup, $ionicModal, $state, chartService, budgetTransaction, subbudgetService) {

  //pre-defined colors for the chart. New categories will be assigned a color from this array in order, afterwhich random colors will be generated. Add more colors here if you want specific ones to show up before random colors are used:
  var chartColorsArr = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#86c8a1', '#4D5360'];

  var user;
  var currentSettings = {};
  var initGroup;
  var chartOptions;
  var colorCount;
  var totalAllocated;
  var deletedCats;
  var initialize = function(){
    user = _.cloneDeep($scope.user);
    currentSettings = {
      budget: user.totalBudget,
      savings: user.savings,
      categories: user.subbudgetArr.slice(),
    };
    deletedCats = [];
    $scope.deletedCats = [];
    $scope.inputs= {};
    $scope.totalSpent = user.totalSpent;
    $scope.inputs.totalBudget = currentSettings.budget;
    $scope.inputs.savingsGoal = currentSettings.savings;
    $scope.budgetCategories = currentSettings.categories.slice();
    $scope.unallocated = parseFloat(user.unallocated).toFixed(2);
    initGroup = [
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
    chartOptions = {
      //String - Template string for single tooltips
      tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
      //String - Template string for multiple tooltips
      //multiTooltipTemplate: "<%= value + ' %' %>"
      animation: user.userOptions.animateChart,
    };
    $scope.chart.options = chartOptions;
    colorCount =   $scope.budgetCategories.length; // we will incrment this color every time a new budget is added and this will be the index of the chartColorsArr that is passed into the budget directive
  };
  initialize();

  var getColor = function(){
    if (colorCount <= chartColorsArr.length-1){
      return chartColorsArr[colorCount];
    }else{
      return chartService.getRandomColor(); //if we are out of pre-defined colors, provide a random color
    }
  };

  var updateChart = function(dataObj){
    $scope.chart.values = dataObj.values;
    $scope.chart.labels = dataObj.labels;
    $scope.chart.colors = dataObj.colors;
  };

  var budgetUpdate = function(categories, total, savings){
    var updated = chartService.budgetUpdate(categories, $scope.inputs.totalBudget, $scope.inputs.savingsGoal);
    totalAllocated = updated.totalAllocated;
    updateChart(updated.chart);
    $scope.goodData = updated.goodData;
    $scope.savingsOverBudget = updated.savingsOverBudget;
    $scope.overBudgetAmt = updated.overBudgetAmt; //parse float?
    $scope.unallocated = updated.unallocated;
  };

  $scope.$watch('budgetCategories', function(newValue, oldValue){
    budgetUpdate(newValue, $scope.inputs.totalBudget, $scope.inputs.savingsGoal);
  }, true);

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal'], function(res, prevRes) {
    if(res) {
      var inputData = chartService.inputValidate(res);
      $scope.parsedBudget = parseFloat($scope.inputs.totalBudget);
      $scope.savingsAmt = inputData.savingsAmt;
      $scope.noBudget = inputData.noBudget;
      budgetUpdate($scope.budgetCategories, $scope.inputs.totalBudget, $scope.inputs.savingsGoal);
    }
  });

  $scope.$watch('userOptions.animateChart', function(newVal){
    chartOptions.animation = newVal;
  });

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
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
      //if the user did not press cancel:
      if (res){
        res.newPrice = parseFloat(res.newPrice);
        var output = {
          tempId: $scope.catId,
          allocated: parseFloat(res.newPrice).toFixed(2),
          category: res.newName,
          color: getColor(),
          new: true,
          totalDisplay: String(parseFloat(res.newPrice).toFixed(2)),
          goodData: true,
        };
        $scope.budgetCategories.push(output);
        chartService.budgetUpdate($scope.budgetCategories, $scope.inputs.totalBudget, $scope.inputs.savingsGoal);
        $scope.catId++; //increment the id for the next one
        colorCount++;
      }
    });
  };

  var saveConfirmPopup = function() {
    $scope.data = {};
    $scope.deletedCats = deletedCats.slice();
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
        writeChangesToDb(deletedCats);
        $state.go('main.budgets');
      }
    });
  };

  var writeChangesToDb = function(deleteArr){
    console.log('savings to db?');
    if($scope.goodData){

      currentSettings.categories = $scope.budgetCategories.slice();
      currentSettings.budget = parseFloat($scope.inputs.totalBudget);
      currentSettings.savings = parseFloat($scope.inputs.savingsGoal);

      //delete the deleted categories from the db:
      var deleteLoop = function(idx){
        if (idx < deleteArr.length){
          subbudgetService.deleteBucket(deleteArr[idx]._id, user.budgetId)
          .then(function(){
            deleteLoop(idx+1);
          }).catch(function(err){
            console.log(err);
            return;
          });
        }
      };
      deleteLoop(0);

      //update the budget array on the db:
      var updateDbBudgetArr = function(idx){
        //create new categories on db:
        if (idx < currentSettings.categories.length){
          if(currentSettings.categories[idx].new){
            var newCategory = {
              budget: user.budgetId,
              category: currentSettings.categories[idx].category,
              allocated: parseFloat(currentSettings.categories[idx].allocated),
              color: currentSettings.categories[idx].color,
            };
            subbudgetService.createBucket(newCategory)
            .then(function(res){
              currentSettings.categories.splice(idx,1,res.data);
              updateDbBudgetArr(idx+1);
            }).catch(function(err){
              console.log(err);
              return;
            });
          }else{ //if it is not new, update its new value:
            subbudgetService.editBucket(currentSettings.categories[idx]._id, currentSettings.categories[idx])
            .then(function(res){
              console.log('edited:', idx, res);
              updateDbBudgetArr(idx+1);
            }).catch(function(err){
              console.log(err);
              return;
            });
          }
        }else{
          var output ={
            _id: user.budgetId,
            amount: currentSettings.budget,
            savings: currentSettings.savings,
            sum: totalAllocated,
            subbudgets: currentSettings.categories
          };
          console.log('output',output);
          budgetTransaction.editBudget(output).then(function(res){
            console.log(res);
          }).catch(function(err){
            console.log(err);
          });
        }
      };
      updateDbBudgetArr(0);
      subbudgetService.getAllBuckets(user.userId).then(function(result){
        console.log(result);
      });
    }
  };


  $scope.save = function(){
    if (deletedCats.length > 0){
      saveConfirmPopup();
    }else{
      writeChangesToDb(deletedCats);
      $state.go('main.budgets');
    }
  };

  $scope.cancel = function(){
    //reset all values to initial states:
    initialize();
    $state.go('main.budgets');
  };

  $scope.showDelete = false;
  $scope.showReorder = false;
  $scope.listCanSwipe = true;

  $scope.changeColor = function(item){
    item.newColor = chartService.getRandomColor();
  };

  $scope.saveEdit = function(item){
    item.goodData = true;
    if (item.newName !== undefined){
      item.category = item.newName;
      item.newName = undefined;
    }
    item.color = item.newColor;
    var inputNum = parseFloat(item.newTotal).toFixed(2);
    if (item.newTotal !== undefined && item.newTotal !== ''){
      if (!isNaN(inputNum) && (inputNum - item.allocated) <= parseFloat($scope.unallocated)){
        item.allocated= item.newTotal;
        item.totalDisplay = String(parseFloat(item.allocated).toFixed(2));
        item.newTotal = undefined;
      }else
      {
        item.goodData = false;
      }
    }
  };

  $scope.deleteCategory = function(item){
    var idx;
    if (!item.new){
      idx = chartService.findIndex($scope.budgetCategories, item._id);
      deletedCats.push(item);
    }else{
      idx = chartService.findIndex($scope.budgetCategories, item.tempId);
    }
    $scope.budgetCategories.splice(idx,1);
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.budgetCategories.splice(fromIndex, 1);
    $scope.budgetCategories.splice(toIndex, 0, item);
  };

  $ionicModal.fromTemplateUrl('templates/budgetsetup-edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    for (var i = 0; i <   $scope.budgetCategories.length; i ++){
        //$scope.budgetCategories[i].newTotal = parseFloat(  $scope.budgetCategories[i].allocated).toFixed(2);
        $scope.budgetCategories[i].totalDisplay = String(parseFloat(  $scope.budgetCategories[i].allocated).toFixed(2));
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
