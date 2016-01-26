angular.module('pushbudget').service('authService', function ($http, $q, absoluteUrl) {
  var that = this;
  var currentUser = null;

  this.login = function (user) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl.url + 'login',
      data: user
    }).then(function (user) {
      currentUser = user.data;
      dfd.resolve(user);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.getCurrentUser = function () {
    return currentUser
  }

  this.getSessionUser = function () {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: absoluteUrl.url + 'currentuser',
      data: ''
    }).then(function (user) {
      currentUser = user.data;
      dfd.resolve(user);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.logout = function () {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: absoluteUrl.url + 'logout',
      data: ''
    }).then(function (res) {
      currentUser = null;
      dfd.resolve(res);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.signup = function (user) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl.url + 'signup',
      data: user
    }).then(function (user) {
      currentUser = user.data;
      dfd.resolve(user);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }
});
