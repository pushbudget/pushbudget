angular.module("pushbudget").controller('signupCtrl', function ($scope, signupService, $ionicPush, registerPush) {

  $scope.signup = function (user) {
    signupService.signup(user).then(function (user) {
      console.log('currently logged in user session', user);
      console.log(user._id);
      device.user = user._id;
      $scope.registerDevice();
      $ionicPush.register();
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