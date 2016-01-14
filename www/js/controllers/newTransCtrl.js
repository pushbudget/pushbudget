angular.module('pushbudget').controller('newTransCtrl', function($scope, $ionicPopup) {

  var price = 10;//this is the ammount of this transaction, need to get it from a ref

  $scope.mainAmmount = parseFloat(price).toFixed(2);

  //ionic stuff for lists
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.categoryArr = []; //array of new categories represented by thier catId number

  var catId = 0; // unique identifier for each new category box, starts at 0 and increments each time a new category is added.

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
      templateUrl: 'templates/newtransAddCat.html',
      title: 'Add New Category',
      //subTitle: 'Please use normal things',
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
      console.log(res);
      var output = {
        id: catId,
        ammount: parseFloat(res.newPrice),
        category: res.newCat,
      };
      //if the user did not press cancel:
      if (res){
        if(parseFloat(res.newPrice) < parseFloat($scope.mainAmmount)){
          $scope.categoryArr.push(output); //add the new category to the category array
          $scope.mainAmmount -= res.newPrice; //subtract this ammount from the main ammount
          $scope.mainAmmount = parseFloat($scope.mainAmmount).toFixed(2); //make sure the cents are displayed
          catId++; //increment the id for the next one
        }
      }
    });
  };

  //this is incomplete
  $scope.editPopup = function(id) {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/newtransAddCat.html',
      title: 'Edit Caategory',
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
      console.log(res);
      var output = {
        id: catId,
        ammount: parseFloat(res.newPrice),
        category: res.newCat,
      };
      //if the user did not press cancel:
      if (res){
        //add logic to edit the ammounts
        //we need to adjust the main ammount relative to the old value and update this category, if the value has changed. also need to check that the user isnt adding a category twice
        $scope.mainAmmount = parseFloat($scope.mainAmmount).toFixed(2); //make sure the cents are displayed

      }
    });
  };


  //this deletes an added category given an id
  $scope.deleteCat = function(id){
    var idx = findCategory(id); //find the current index of the category with this id
    console.log($scope.categoryArr[idx].ammount);
    //re-add this ammount back to the main ammount
    var newSum = (parseFloat($scope.mainAmmount) + parseFloat($scope.categoryArr[idx].ammount));
    $scope.mainAmmount = parseFloat(newSum).toFixed(2); //make sure the cents are displayed
    $scope.categoryArr.splice(idx, 1); //remove that element from the array
  };

  //this is incomplete
  $scope.editCat = function(id){
    var idx = findCategory(id); //find the current index of the category with this id
    //add edit stuff here
  };

  //this is when the user clicks the green checkbox indicating that they wish to submit their changes
  $scope.submit = function(){
    //do something to save this to the DB
    console.log('submit clicked!');
  };

});
