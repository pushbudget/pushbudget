angular.module('pushbudget').service('transactionService', function ($http, $q) {


  // transaction endpoints

  // get all transactions for particular user


  return {

    this.getAllUserTransactions: function (userId) {
      var dfd = $q.defer();
      $http({
          method: 'POST',
          url: '/api/transactions/user/:userId'
        }).then(function (res) {
          dfd.resolve(res);
        })
        .catch(function (err) {
          dfd.resolve(err);
        });
      return dfd.promise;
    }



    editGroup: function (id, admin, group) {
        group.admin = admin;
        var dfd = $q.defer();
        $http({
          method: 'PUT',
          url: '/api/groups/' + id,
          data: group
        }).then(function (group) {
          getGroup(id).then(function (response) {
            dfd.resolve(response.data);
          });
        });
        return dfd.promise;
      },

      this.getAllUserTransactions = function (userId) {
        var dfd = $q.defer();
        $http({

          }).then(function (res) {
            dfd.resolve(res);
          })
          .catch(function (err) {
            dfd.resolve(err);
          });
      }
    return dfd.promise;
  },

  this.editSpecificUserTransactions: function (userId) {
      var dfd = $q.defer();
      $http.patch()
    },

    this.deleteSpecificUserTransactions: function (userId) {
      var dfd = $q.defer();
      $http.delete()
    },

    this.getAllUserUntagged: function (userId) {
      var dfd = $q.defer();
      $http.get()
    }
}
});