angular.module('pushbudget').service('userService', function ($http, $q, $state) {
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

  this.loginUser = function(user){
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/login',
      data: user
    }).then(function (res) {
      console.log("user service: ",res);
      dfd.resolve(user);
      $state.go('main.home', user);
    }).catch(function (user) {
      dfd.reject(user);
    });
    return dfd.promise;
  }
});
