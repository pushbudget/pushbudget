angular.module('pushbudget').service('splitTransaction', function ($http, $q, absoluteUrl) {

  // transaction split view, if no splits...transaction is added to bucket.
  // if there are splits, the parent transaction is not added and
  // only the child transctions, aka shadow or split, are added
  // to the subbudget splits array

  this.addSplitTransaction = function (transaction, splits) {
    console.log(transaction);
    console.log('break');
    console.log(splits);
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl + 'api/split/',
      data: {
        transaction: {
          transId: transaction._id,
          subbudgetId: splits[0].subId
        },
        splits: splits
      }
    }).then(function (bucket) {
      dfd.resolve(bucket)
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

});
