angular.module('pushbudget').controller('budgetSetupCtrl', function($scope, $ionicPopup, $ionicModal) {

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
  var initBudget = 100;
  var initSavings = 0;
  var initSpent = 0;

  var initCats = [
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


  $scope.inputs= {};

  $scope.totalSpent = initSpent;
  $scope.inputs.totalBudget = initBudget;
  var categories = initCats.slice();
  $scope.budgetCategories = categories.slice();
  var budgetSum = 0;
  var savings = initSavings;
  for (var j = 0; j < categories.length; j++){
    budgetSum += categories[j].total;
  }
  var unallocated = parseFloat($scope.inputs.totalBudget) - savings - budgetSum;
  $scope.unallocated = parseFloat(unallocated).toFixed(2);

  var initGroup = [
    {
      name: 'Savings',
      total: 0
    },
    {
      name: 'Unbudgeted',
      total: 0
    }
  ];
  var updateInitGroup = function(savings, unallocated){
    initGroup[0].total = savings;
    initGroup[1].total = unallocated;
  };
  updateInitGroup(savings, unallocated);

  $scope.chart = {};
  $scope.chart.labels = [];
  $scope.chart.values = [];
  chartOptions = {
    //String - Template string for single tooltips
    tooltipTemplate: "<%= label %>: $<%= parseFloat(value).toFixed(2) %>", //"<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
    //String - Template string for multiple tooltips
    //multiTooltipTemplate: "<%= value + ' %' %>"
  };
  $scope.chart.options = chartOptions;
  var chartColorsArr = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']; //these are taken from angular-chart.js Chart.defaults.global.colours
  var colorCount = categories.length; // we will incrment this color every time a new budget is added and this will be the index of the chartColorsArr that is passed into the budget directive

  var chartUpdate = function(){
    //used for chart (chart takes two seperate arrays of data that we have to split)
    var chartValues = [];  //array of values for categories
    var chartLabels = [];  //array of labels for categories
    for (var i = 0; i < initGroup.length; i++ ){
      chartValues.push(parseFloat(initGroup[i].total));
      chartLabels.push(initGroup[i].name);
    }
    for (i = 0; i < categories.length; i++){
      chartValues.push(parseFloat(categories[i].total));
      chartLabels.push(categories[i].name);
    }
    $scope.chart.values = chartValues.slice();
    $scope.chart.labels = chartLabels.slice();

    //console.log('chart values:', chartValues);
  };

  var budgetUpdate = function(){
    var newSum = 0;
    for (var i = 0; i < categories.length; i ++){
      newSum += parseFloat(categories[i].total);
    }
    var currentTotal = parseFloat($scope.inputs.totalBudget);
    if (isNaN(currentTotal) || currentTotal <=0){
      currentTotal = 1; //must have at least 1 to have the chart showup
    }
    var currentSavings = parseFloat($scope.inputs.savingsGoal);
    if (isNaN(currentSavings)){
      currentSavings = 0;
    }
    var newUnallocated = currentTotal - currentSavings - newSum;
    $scope.unallocated = parseFloat(newUnallocated).toFixed(2);
    updateInitGroup(currentSavings, newUnallocated);
    chartUpdate();
  };

  $scope.$watch('budgetCategories', function(newValue, oldValue){
    budgetUpdate();
  }, true);

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal'], function(res, prevRes) {
    if(res) {
      if(isNaN(res[1]) || res[1] < 0){
        savings = 0;
      }
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
          color: chartColorsArr[colorCount],
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

  $scope.showDelete = false;
  $scope.showReorder = true;
  $scope.listCanSwipe = true;

  $scope.deleteCategory = function(item){
    console.log(item);
    var idx = findIndex(item.id);
    console.log(idx);
    $scope.budgetCategories.splice(idx,1);
    console.log($scope.budgetCategories);
    //put in some array or object that is then passed upon pressing save which will then trigger the back end to do some delete stuff
  };

  $scope.editCategory = function(item){
    console.log(item);
    //edit stuff
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
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
