angular.module('pushbudget').service('splitTransaction', function ($http, $q, absoluteUrl) {

  // transaction split view, if no splits...transaction is added to bucket.
  // if there are splits, the parent transaction is not added and
  // only the child transctions, aka shadow or split, are added
  // to the subbudget splits array


  this.addTransactionToBucket = function (transaction, subbudgetId) {

  }
  this.addSplitTransaction = function (transaction, splits) {
<<<<<<< HEAD

    console.log(555555, transaction);
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl + 'api/split/' + subbudgetId,
      data: transaction
=======
    console.log(transaction);
    console.log('break');
    console.log(splits);
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: absoluteUrl.url + 'api/split/',
      data: {
        transaction: {
          transId: transaction._id,
          subbudgetId: splits[0].subbudgetId
        },
        splits: splits
      }
>>>>>>> c882a3f7f3a7129f7f690dba12675f5fb2cac9fd
    }).then(function (bucket) {
      console.log(bucket);
      dfd.resolve(bucket)
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

});