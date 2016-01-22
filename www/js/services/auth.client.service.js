angular.module('pushbudget').service('authService', function ($http, $q) {
  console.log('auth service');
  var that = this;
  var currentUser = null;

  this.login = function (user) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/login',
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
      url: 'http://localhost:3001/currentuser',
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
      url: 'http://localhost:3001/logout',
      data: ''
    }).then(function (res) {
      console.log(currentUser);
      currentUser = null;
      console.log(currentUser);
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
      url: 'http://localhost:3001/signup',
      data: user
    }).then(function (user) {
      console.log(user);
      console.log('')
      console.log('SHALLOW COPY', user.data);
      currentUser = user.data;
      dfd.resolve(user);

    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }
});
