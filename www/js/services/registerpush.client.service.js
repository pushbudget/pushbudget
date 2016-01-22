angular.module('pushbudget').service('registerPush', function ($q, $http, absoluteUrl) {

  this.registerDevice = function (device) {

    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl.url + 'api/device',
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
      url: absoluteUrl.url + 'api/registerToken',
      data: token
    }).then(function (res) {
      dfd.resolve(res);
    }).catch(function (err) {
      dfd.reject(res);
    })
    return dfd.promise;
  }

});