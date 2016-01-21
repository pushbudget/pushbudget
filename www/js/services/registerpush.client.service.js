angular.module('pushbudget').service('registerPush', function ($q, $http) {

  this.registerDevice = function (device) {

    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/api/device',
      data: device
    }).then(function (res) {
      dfd.resolve(res);
    }).catch(function (err) {
      dfd.reject(res);
    })
    return dfd.promise;
  }

  this.registerToken = function (token) {

    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/api/registerToken',
      data: token
    }).then(function (res) {
      dfd.resolve(res);
    }).catch(function (err) {
      dfd.reject(res);
    })
    return dfd.promise;
  }

});