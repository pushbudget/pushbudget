angular.module('pushbudget').service('transactionService', function ($http, $q, absoluteUrl) {

  console.log('hey im in here');

  // transaction endpoints

  // get all transactions for particular user
  this.getAllUserTransactions = function (userId) {
    var dfd = $q.defer();
    $http({
        method: 'GET',
        url: absoluteUrl.url + 'api/transactions/user/' + userId
      }).then(function (res) {
        dfd.resolve(res.data);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  // get specific transaction for user
  this.getSpecificUserTransaction = function (transId) {
    var dfd = $q.defer();
    $http({
        method: 'GET',
        url: absoluteUrl.url + 'api/transactions/' + transId
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  // edit specific transaction
  this.editSpecificUserTransaction = function (transId, editedTransaction) {
    var dfd = $q.defer();
    $http({
        method: 'PATCH',
        url: absoluteUrl.url + 'api/transactions/' + transId,
        data: editedTransaction
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  this.deleteSpecificUserTransaction = function (transId) {
    var dfd = $q.defer();
    $http({
        method: 'DELETE',
        url: absoluteUrl.url + '/api/transactions/' + transId
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  this.getAllUserUntagged = function (userId) {
    var dfd = $q.defer();
    $http({
        method: 'GET',
        url: absoluteUrl.url + 'api/transactions/untagged/' + userId
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

});
