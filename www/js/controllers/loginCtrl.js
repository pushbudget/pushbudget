angular.module('pushbudget').controller('loginCtrl', function($scope, $state, loginService) {
      $scope.login = function(user){
        console.log(user);
        loginService.login(user).then(function(res){
            if(res.data){
              $state.go('main.home');
            }
            else{
              alert('User unregistered or incorrect user/password combo');
            }
        });
      };
})
