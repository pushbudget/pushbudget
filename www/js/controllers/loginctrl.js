angular.module('pushbudget').controller('loginCtrl', function ($scope, $state, authService,$ionicLoading) {
  $scope.login = function (user) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    console.log(user);
    authService.login(user).then(function (res) {
      if (res.data) {
        $state.go('main.home');
        $ionicLoading.hide();
      } else {
        $ionicLoading.hide();
        alert('User unregistered or incorrect user/password combo');
      }
    });
  };
});
