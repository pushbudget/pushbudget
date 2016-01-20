angular.module('pushbudget').service('loginService', function ($http, $q) {

  var that = this;
  var currentUser = null;

  this.login = function (user) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/login',
      data: user
    }).then(function (user) {
      that.currentUser = user.data;
      dfd.resolve(user);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.getCurrentUser() {
    return currentUser
  }

  /*
    this.getCurrentUser = function () {
      var dfd = $q.defer();
      $http({
        method: 'GET',
        url: 'http://localhost:3001/currentuser',
        data: ''
      }).then(function (user) {
        console.log('THIS IS A BAD USER', user);
        that.currentUser = user.data;
        dfd.resolve(user);
      }).catch(function (err) {
        dfd.reject(err);
      });
      return dfd.promise;
    }
  */

});