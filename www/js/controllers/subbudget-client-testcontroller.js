angular.module('pushbudget').controller('subbudgetTest', function ($scope, subbudgetService) {

  // test variables
  console.log('SUB CONTROLLER');
  var bucketId = '56978f3078f86e102af85bcd';

  // dummy edit from the front-end
  var editedBucket = {
    allocated: 69
  }

  // bucket dummy object representing what is input by the user
  var bucketObj = {
    budget: '',
    allocated: 50,
    category: 'dog food',
    created: ''
  }


  $scope.getBucket = function (bucketId) {
    subbudgetService.getBucket(bucketId).then(function (res) {
      console.log(res);
      console.log(res.data);
    })
  }

  $scope.createBucket = function (bucketId, bucketObj) {
    subbudgetService.createBucket(bucketId).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  $scope.editBucket = function (bucketId, editedBucket) {
    subbudgetService.editBucket(bucketId, editedBucket).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  $scope.deleteBucket = function (bucketId) {
    subbudgetService.deleteBucket(bucketId).then(function (res) {
      console.log(res);
      console.log(res.data);
    });
  }

  //TEST SERVICE HTTP CALLS FOR EACH

  $scope.getBucket(bucketId);
  /*$scope.createBucket(bucketObj);*/
  /*$scope.editBucket(bucketId, editedBucket);*/
  /*$scope.deleteBucket('56995b5b43dd76815c941d8e');*/

});