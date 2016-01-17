angular.module('pushbudget').service('userService', function ($http, $q) {
  console.log("up in here");
  this.getUserFromDb = function (userId) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: 'http://localhost:3001/user/' + userId + '/populate'
    }).then(function (user) {
      console.log("up in here");
      dfd.resolve(user);
    }).catch(function (user) {
      dfd.reject(user);
    });
    return dfd.promise;
  }
});