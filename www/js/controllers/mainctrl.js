angular.module('pushbudget').controller('mainCtrl', function ($scope, userService) {

  //replace this later with a ref to the user which will be aquired during initial splash screen load
  userService.getUserFromDb('5696bd87e4b07f04a7491c6b').then(function (res) {
    $scope.currentUser = res.data;
  });

  $scope.updateUser = function (args) {
    //stuff
    userService.getUserFromDb().then(function (res) {
      $scope.currentUser = res.data;
    })
  };


});