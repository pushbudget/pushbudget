angular.module('pushbudget').service('userService', function ($http, $q) {
  console.log("up in here");
  this.getUserFromDb = function (userId) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: 'http://localhost:3001/api/user/' + userId
    }).then(function (user) {
      console.log("up in here");
      dfd.resolve(user);
    }).catch(function () {
      dfd.reject(user);
    });
    return dfd.promise;
  }
});