angular.module('pushbudget').controller('loginCtrl', function($scope, loginService) {
      $scope.login = function(user){
        console.log(user);
        loginService(user).then(function(res){
            console.log("loginctrl:", res);
        });
      };
})
