angular.module('pushbudget.controllers', []).controller('loginCtrl', function($scope, loginService) {
      $scope.login = function(user){
        console.log(user);
        userService.loginService(user).then(function(res){
            console.log("loginctrl:", res);
        });
      };
})
