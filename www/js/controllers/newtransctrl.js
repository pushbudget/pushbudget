angular.module('pushbudget').controller('newtransctrl', function($scope, $ionicPopup, transaction, splitTransaction, splitsRef, $ionicLoading, userDataService, $state, budgetTransaction) {
  console.log('transaction:',transaction);
  console.log('splitsRef', splitsRef);


  var idArr = []; //array of subbudget ids
  for (var i = 0; i < $scope.user.subbudgetArr.length; i++){
    idArr.push($scope.user.subbudgetArr._id);

  }

  $scope.categoryArr = []; //array of new categories represented by thier catId number


  $scope.splitsArr = splitsRef;
  if (splitsRef.length > 0){
    $scope.transaction = splitsRef[0];
  }




  var catId = 0; // unique identifier for each new category box, starts at 0 and increments each time a new category is added.

  $scope.transaction = transaction;
  console.log($scope.transaction);
  var totalPrice = transaction.amount;//this is the total ammount of this transaction, need to get it from a ref
  $scope.mainAmmount = parseFloat(totalPrice).toFixed(2);

  $scope.categoryOptions = $scope.user.subbudgetArr;
  $scope.mainCategory = $scope.categoryOptions[0]; //this the existing category. it will later come from a ref


  //ionic stuff for lists
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;



  //given a categoryId, return the index of where in the array the object with that id resides
  var findCategory = function(id){
    var arr = $scope.categoryArr.slice();
    for (var i = 0; i < arr.length; i++){
      if (arr[i].id === id){
        return i;
      }
    }
    return false; //return false if no match is found (this should not happen unless something is broken)
  };

  $scope.showPopup = function() {
    $scope.data = {};


    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/newtrans-addcat.html',
      title: 'Add New Category',
      subTitle: 'Split this transaction into multiple categories',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.newPrice) {
              //don't allow the user to close unless he enters a new price
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
          id: catId,
          ammount: parseFloat(res.newPrice).toFixed(2),
          category: res.categoryOption,
        };
        if(parseFloat(res.newPrice) < parseFloat($scope.mainAmmount)){
          $scope.categoryArr.push(output); //add the new category to the category array
          $scope.mainAmmount -= res.newPrice; //subtract this ammount from the main ammount
          $scope.mainAmmount = parseFloat($scope.mainAmmount).toFixed(2); //make sure the cents are displayed
          catId++; //increment the id for the next one
        }
      }
    });
  };

  $scope.editPopup = function(id) {
    $scope.data = {};
    var idx = findCategory(id); //the index of the element we are editing


    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/newtrans-addcat.html',
      title: 'Edit Category',
      subTitle: 'Current ammount: $' + parseFloat($scope.categoryArr[idx].ammount).toFixed(2),
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.newPrice) {
              //don't allow the user to close unless he enters a new price
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
        res.newPrice = parseFloat(res.newPrice); //convert from string to float
        var output = {
          ammount: parseFloat(res.newPrice).toFixed(2),
          category: res.categoryOption,
        };
        //make sure the edited value does not exceed the total price
        //***** need to include logic that takes into accout other sub-categories
        var arrSum = 0;
        //find the sum of all ammounts other than this one, to ensure that the user did not enter a value that exceeds the total ammount
        for (var i = 0; i < $scope.categoryArr.length; i++){
          if (i !== idx){
            arrSum += parseFloat($scope.categoryArr[i].ammount);
          }
        }
        //make sure the new ammount is not more than the total ammount possible
        if (arrSum + res.newPrice < totalPrice){
          var editObj = $scope.categoryArr[idx]; //this is the element we are editing
          var dif = parseFloat(editObj.ammount) - res.newPrice; //the difference between the old price and the new one
          var ammount = parseFloat($scope.mainAmmount);
          ammount += parseFloat(dif);
          $scope.mainAmmount = ammount;
          $scope.mainAmmount = parseFloat($scope.mainAmmount).toFixed(2); //make sure the cents are displayed
          editObj.ammount = parseFloat(res.newPrice).toFixed(2);
          editObj.category = res.categoryOption;
        } else {
          console.log('error:', arrSum, '+', res.newPrice, '>', totalPrice);
          //do something here
        }
      }
    });
  };

  //this deletes an added category given an id
  $scope.deleteCat = function(id){
    var idx = findCategory(id); //find the current index of the category with this id
    //re-add this ammount back to the main ammount
    var newSum = (parseFloat($scope.mainAmmount) + parseFloat($scope.categoryArr[idx].ammount));
    $scope.mainAmmount = parseFloat(newSum).toFixed(2); //make sure the cents are displayed
    $scope.categoryArr.splice(idx, 1); //remove that element from the array
  };

  //this is when the user clicks the green checkbox indicating that they wish to submit their changes
  $scope.submit = function(){
    console.log($scope.$$childTail.data.categoryOption);
    var subIds = [];
    for(var i = 0; i < $scope.user.subbudgetArr.length; i ++){
      subIds.push({
        category: $scope.user.subbudgetArr[i].category,
        id: $scope.user.subbudgetArr[i]._id
      });
    }
    console.log(subIds);
    var splits = [];
    splits.push({
      amount: parseFloat($scope.mainAmmount),
      subbudgetId: $scope.$$childTail.data.categoryOption._id
    });
    for( i = 0; i < $scope.categoryArr.length; i++){
      var split = {};
      split.amount = parseFloat($scope.categoryArr[i].ammount);
      for(var j = 0; j < subIds.length; j++){
        if(subIds[j].category === $scope.categoryArr[i].category.category){
          split.subbudgetId = subIds[j].id;
        }
      }
      splits.push(split);
    }
    console.log($scope.transaction, splits);

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    // var = transId
    // subBudgetArray.map(function(budge, inx){
    //   budget.transactions.map(function(transaction,inx){
    //     transaction._id === transId ? inx : -1
    //   }).filter(function(transaction){
    //     return transaction > -1
    //   })[0]
    // })
    // sub
    console.log(transaction._id);
    if (transaction._id === $scope.user.untaggedArr[0]._id){
      console.log('yes');
    }else console.log('no');
    console.log($scope.user.untaggedArr);
        console.log($scope.user.untaggedArr[0]._id);

    var findIdx = function(id){
      var res = $scope.user.untaggedArr.map(function(el, idx){
       return   el._id === id ? idx : -1;
      }).filter(function(el){
        return el > -1;
      });
    return res[0];
    };
    console.log(findIdx());


    splitTransaction.addSplitTransaction($scope.transaction, splits)
    .then(function(res){
      //console.log('this is the response',res);
      }).then(function(){
        $scope.user.untaggedArr.splice(findIdx(transaction._id),1);
        return budgetTransaction.getPopBudget($scope.user.userId);
      }).then(function(res){
        console.log('response',res);
        var calcObj = userDataService.calcSums(res.data.subbudgets, $scope.user.totalUserBudget);
        console.log('calc obj',calcObj);
        $scope.user.subbudgetArr = calcObj.subbudgets.slice();
        console.log($scope.user);
        $ionicLoading.hide();
        $state.go('main.home');
      }).catch(function(err){
        $ionicLoading.hide();
        console.log(err);
    });
  };

});
