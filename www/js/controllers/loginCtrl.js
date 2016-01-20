angular.module('pushbudget.controllers', []).controller('loginCtrl', function($scope) {
      $scope.login = function(user){
        console.log(user);
        userService.loginUser(user).then(function(res){
            console.log("loginctrl:", res);
        })
      }
})
