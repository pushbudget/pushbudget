angular.module('pushbudget').service('splitTransaction', function ($http, $q, absoluteUrl) {

  // transaction split view, if no splits...transaction is added to bucket.
  // if there are splits, the parent transaction is not added and
  // only the child transctions, aka shadow or split, are added
  // to the subbudget splits array

<<<<<<< HEAD
  this.addTransactionToBucket = function (transaction, subbudgetId) {
=======
  this.addSplitTransaction = function (transaction, splits) {
>>>>>>> 813cf2e1b7a23e960cefb770c1b7f31670975c7c
    console.log(555555, transaction);
    var dfd = $q.defer();
    $http({
      method: 'POST',
<<<<<<< HEAD
      url: absoluteUrl + 'api/split/' + subbudgetId,
=======
      url: absoluteUrl + 'api/split/',
>>>>>>> 813cf2e1b7a23e960cefb770c1b7f31670975c7c
      data: transaction
    }).then(function (bucket) {
      dfd.resolve(bucket)
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

});
