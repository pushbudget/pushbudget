angular.module('pushbudget').service('budgetTransaction', function ($http, $q, absoluteUrl) {

  // attach userId to the budget object from controller
  // need the userId for express endpoints
  // _id(the actual id of the budget) should be on the budget object passed to the service calls


  this.getBudget = function (budget) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: absoluteUrl.url + 'api/budget/' + budget.userId,
      data: budget
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  };

  this.getPopBudget = function (userId) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: absoluteUrl.url + 'api/budget/' + userId +'/populate'
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  };


  this.editBudget = function (budget) {
    var dfd = $q.defer();
    $http({
      method: 'PATCH',
      url: absoluteUrl.url + 'api/budget/' + budget._id,
      data: budget
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.deleteBudget = function (budget) {
    var dfd = $q.defer();
    $http({
      method: 'DELETE',
      url: absoluteUrl.url + budget._id + '/' + budget.userId,
      data: budget
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.postBudget = function (budget) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl.url + 'api/budget/' + budget.userId,
      data: budget
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }
});
