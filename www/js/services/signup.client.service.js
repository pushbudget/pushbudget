angular.module('pushbudget').service('signupService', function ($q, $http, loginService) {

  this.signup = function (user) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/signup',
      data: user
    }).then(function (user) {
      return loginService.getSessionUser().then(function (user) {
        dfd.resolve(user);
      });
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }
});