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

  //  dummy data
  $scope.totalSpent = 0;

  // $scope.data = [300, 500, 100, 1500, 230, 56, 678];
  // /dummy data

  $scope.inputs= {};
  $scope.categoryArr = [];

  $scope.catId = 0; // unique identifier for each new category box, starts at 0 and increments each time a new category is added.

  $scope.unallocated = 0;
  $scope.chart = {};

  var initLabelsArr = ['Savings', 'Unallocated']; //initial labels
  var total = 0;
  var unallocated = 0;
  var savings = 0;
  var chartCatValues = [];  //array of values for categories
  var chartCatLabels = [];  //array of labels for categories

  $scope.$watch('catId', function(nextId, thisId){
    if($scope.categoryArr.length > 0){
       console.log('new category added', thisId);
       chartCatValues.push(parseFloat($scope.categoryArr[thisId].total));
       chartCatLabels.push($scope.categoryArr[thisId].name);
     }

  });

  $scope.$watchGroup(['inputs.totalBudget', 'inputs.savingsGoal', 'catId'], function(res, prevRes) {
    console.log('************');
    if(res) {
      var totalBudget = res[0];
      var savingsGoal = res[1];
      var catId = prevRes[2]; //the last catId to be added
      var nextCatId = res[2];
      var valuesSum = 0;

      console.log(catId, nextCatId);

      if (nextCatId > 0){
        for (var i = 0; i < chartCatValues.length; i++){
          valuesSum += chartCatValues[i];
        }
        console.log('valueSum', valuesSum);
      }

      $scope.goodData = false;
      console.log('totes:',totalBudget);
      if(!isNaN(totalBudget) && totalBudget > 0){
        total = parseFloat(totalBudget);
        $scope.goodData = true;
        $scope.totalBudget = totalBudget;
      }else{
        total = 1; //a default value of 1 shows a blank chart
      }

      //dont include savings if it is undefined (eg, the user declined to enter a value)
      if (savingsGoal){
        savings = parseFloat(savingsGoal);
      }else savings = 0;

      unallocated = total - (savings + valuesSum); //in the parenthesis needs to be a fn that will loop through the total of all budgets + savings and return the sum
      if (unallocated < 0){
        unallocated = undefined; //this will make the chart go away, in this case we need to display something else signifiying that the user is overbudget. Otherwise the chart seems to just take absolute values of negative numbers and the result is a mess
      }

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
 $scope.chart.values = [0];

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
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.newPrice || !$scope.data.newName) {
              //don't allow the user to close unless they enters a new price and name.
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
        };
        $scope.categoryArr.push(output); //add the new category to the category array
        $scope.catId++; //increment the id for the next one
        console.log($scope.categoryArr);
      }
    });
  };


});
