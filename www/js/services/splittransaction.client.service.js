angular.module('pushbudget').service('splitTransaction', function ($http, $q, absoluteUrl) {

  // transaction split view, if no splits...transaction is added to bucket.
  // if there are splits, the parent transaction is not added and
  // only the child transctions, aka shadow or split, are added
  // to the subbudget splits array

  this.getSplitTransactions = function(transactionId){
    console.log('service');
    return $q(function(resolve, reject){
        $http({
        method: 'GET',
        url: absoluteUrl.url + 'api/splits/' +transactionId,
      }).then(function(res){
          resolve(res.data);
      }).catch(function(err){
        console.log(err);
        reject(err);
      });
    });
  };


  this.addSplitTransaction = function (transaction, splits) {


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
    }).then(function (bucket) {
      console.log(bucket);
      dfd.resolve(bucket)
    }).catch(function (err) {
      dfd.reject(err);
    });
    return dfd.promise;
  }

});
