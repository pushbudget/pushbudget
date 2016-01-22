angular.module('pushbudget').controller('loginCtrl', function ($scope, $state, authService) {
  $scope.login = function (user) {
    console.log(user);
    authService.login(user).then(function (res) {
      if (res.data) {
        $state.go('main.home');
      } else {
        alert('User unregistered or incorrect user/password combo');
      }
    });
  };
});
