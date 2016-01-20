angular.module('pushbudget').controller('loginCtrl', function ($scope, userService) {

    $scope.login = function(user){
      console.log(user);
      userService.loginUser(user).then(function(res){
        console.log("loginctrl:", res);
      })
    }
});
