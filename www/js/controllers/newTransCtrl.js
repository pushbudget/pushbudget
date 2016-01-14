angular.module('pushbudget').controller('newTransCtrl', function($scope, $ionicPopup) {

  //ionic stuff for lists
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.categoryArr = []; //array of new categories represented by thier catId number

  var catId = 0; // unique identifier for each new category box, starts at 0 and increments each time a new category is added.

  //this is not yet fully functional
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
            if (!$scope.data) {
              //don't allow the user to close unless he enters wifi password
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
      $scope.categoryArr.push(catId); //add the new category to the category array
      catId++; //increment the id for the next one
    });
   };

   //this deletes an added category given an id
   $scope.deleteCat = function(id){
     var idx = $scope.categoryArr.indexOf(id); //find the current index of the category with this id
     $scope.categoryArr.splice(idx, 1); //remove that element from the array
   };

   $scope.editCat = function(id){
     var idx = $scope.categoryArr.indexOf(id); //find the current index of the category with this id
     //add edit stuff here
   };

   //this is when the user clicks the green checkbox indicating that they wish to submit their changes
  $scope.submit = function(){
    //do something to save this to the DB
    console.log('submit clicked!');
  };

});
