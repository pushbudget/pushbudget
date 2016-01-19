angular.module('pushbudget').service('budgetTransaction', function ($http, $q) {

  // attach userId to the budget object from controller
  // need the userId for express endpoints
  // _id(the actual id of the budget) should be on the budget object passed to the service calls


  this.getBudget = function (budget) {
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: 'http://localhost:3001/api/budget/' + budget.userId,
      data: budget
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

  this.editBudget = function (budget) {
    var dfd = $q.defer();
    $http({
      method: 'PATCH',
      url: 'http://localhost:3001/api/budget/' + budget._id,
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
      url: 'http://localhost:3001/api/budget/' + budget._id + '/' + budget.userId,
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
      url: 'http://localhost:3001/api/budget/' + budget.userId,
      data: budget
    }).then(function (budget) {
      dfd.resolve(budget);
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }
});