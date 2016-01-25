angular.module('pushbudget').service('subbudgetService', function ($http, $q, absoluteUrl) {

  console.log('we are in the subbudget service');

  // Bucket endpoints.  Buckets === subbudget: analagous.

  this.getAllBuckets = function(userId){
    var dfd = $q.defer();
    $http({
        method: 'GET',
        url: absoluteUrl.url + 'api/user/subbudget/' + userId
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  };

  // get a particular bucket, tied to a user
  this.getBucket = function (bucketId) {
    var dfd = $q.defer();
    $http({
        method: 'GET',
        url: absoluteUrl.url + 'api/subbudget/' + bucketId
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  // edit specific bucket, tied to a user
  this.editBucket = function (bucketId, editedBucket) {
    var dfd = $q.defer();
    $http({
        method: 'PATCH',
        url: absoluteUrl.url + 'api/subbudget/' + bucketId,
        data: editedBucket
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  // delete a specific bucket, tied to a user
  // need to pass the budgetId as another paramter here
  // to facilitate some backend logic
  this.deleteBucket = function (bucketId, budgetId) {
    var dfd = $q.defer();
    $http({
        method: 'DELETE',
        url: absoluteUrl.url + 'api/subbudget/' + bucketId + '/' + budgetId
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

  // need to pass the budgetID on the bucketObj in order to
  // do some work on the backend, adding bucket to budget
  this.createBucket = function (bucketObj) {
    var dfd = $q.defer();
    $http({
        method: 'POST',
        url: absoluteUrl.url + 'api/subbudget/' + bucketObj._id,
        data: bucketObj
      }).then(function (res) {
        dfd.resolve(res);
      })
      .catch(function (err) {
        dfd.reject(err);
      });
    return dfd.promise;
  }

});
