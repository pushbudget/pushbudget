angular.module('pushbudget').service('userService', function ($http, $q) {
  console.log("user service");
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


  var getUserFromDb = function (userId) {
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
  };

  this.getCurrentUser = function(){
    getUserFromDb('5696bd87e4b07f04a7491c6b').then(function(res){
      console.log(res.data);
      //return res.data;
    });
  };
});
