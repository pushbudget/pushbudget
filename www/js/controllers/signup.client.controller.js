angular.module("pushbudget").controller('signupCtrl', function ($scope, $state, authService, $ionicPush, registerPush) {

  $scope.signup = function (user) {
    authService.signup(user).then(function (user) {
      device.user = user._id;
      $scope.registerDevice();
      $ionicPush.register();
      $state.go('main.home');
    });
  };

  var device = {
    uuid: ionic.Platform.device(),
    model: "",
    platform: ionic.Platform.platform(),
    version: ionic.Platform.version()
  };

  $scope.registerDevice = function (device) {
    registerPush.registerDevice(device).then(function (device) {
      console.log('device', device);
    });
  }

  $ionicPush.init({
    debug: true,
    onNotification: function (notification) {

    },
    onRegister: function (data) {
      var token = {
        token: data.token,
        userId: device.user
      }
      registerPush.registerToken(token).then(function () {

      });
    }

  });
});