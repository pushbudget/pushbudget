angular.module('pushbudget').service('userService', function ($http, $q, absoluteUrl) {
  console.log("user service");
  this.getUserFromDb = function (userId) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: absoluteUrl.url + 'user/' + userId + '/populate'
    }).then(function (user) {
      dfd.resolve(user);
    }).catch(function (user) {
      dfd.reject(user);
    });
    return dfd.promise;
  }


  var getUserFromDb = function (userId) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: absoluteUrl.url + 'user/' + userId + '/populate'
    }).then(function (user) {
      dfd.resolve(user);
    }).catch(function (user) {
      dfd.reject(user);
    });
    return dfd.promise;
  };

});
