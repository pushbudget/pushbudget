angular.module('pushbudget').controller('splitTransaction', function ($scope, splitTransaction) {
  console.log('test');
  var testTransaction = {
    transId: "56978a2578f86e102af85bb2",
    splits: [{
        amount: 100.00,
        bucketId: "56978f3078f86e102af85bd1"
    },
      {
        amount: 2.00,
        bucketId: "56978f3078f86e102af85bd2"
    }
    ]
  };

  splitTransaction.addTransactionToBucket(testTransaction).then(function (res) {
    console.log(res);
  });
});