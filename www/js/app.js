// Push Budget

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('pushbudget', ['ionic', 'ionic.service.core', 'pushbudget.controllers', 'chart.js', 'ionic.service.push', 'ui.router'])

.constant("absoluteUrl", {
    "url": 'https://warm-inlet-29190.herokuapp.com/'
  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $urlRouterProvider.otherwise('/login');

  $stateProvider
  // setup an abstract state for the tabs directive
    .state('main', {
    url: '/main',
    abstract: true,
    //cache:false,
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl',
    resolve: {
      userRef: function (authService, $state, userService, $stateParams) {
        if (authService.getCurrentUser() === null) {
          $state.go('login');
        }
        var userId = authService.getCurrentUser()._id;
        return userService.getUserFromDb(userId).then(function (res) {
          return res.data;
        });
      },
      untaggedRef: function (authService, transactionService) {
        var id = authService.getCurrentUser()._id;
        return transactionService.getAllUserUntagged(id)
          .then(function (transactions) {
            return transactions.data;
          });
      }
    },
  })

  // Each tab has its own nav history stack:

  .state('main.home', {
    cache: false,
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    },
  })

  .state('main.toTrans', {
    cache: false,
    url: '/toTrans/:id',
    views: {
      'home': {
        templateUrl: 'templates/newtransaction.html',
        controller: 'newtransctrl'
      }
    },
    resolve: {
      transaction: function ($stateParams, transactionService) {
        console.log($stateParams.id);
        return transactionService.getSpecificUserTransaction($stateParams.id).then(function (res) {
          console.log(res.data);
          return res.data[0];
        });
      }
    }
  })

  .state('main.trans', {
    cache: false,
    url: '/trans',
    views: {
      'transactions': {
        templateUrl: 'templates/transactions.html',
        controller: 'transCtrl'
      },
    }

  })

  .state('main.newTrans', {
    cache: false,
    url: '/newtrans/:id',
    views: {
      'transactions': {
        templateUrl: 'templates/newtransaction.html',
        controller: 'newtransctrl'
      }
    },
    resolve: {
      // transaction: function ($stateParams, transactionService) {
      //   console.log($stateParams.id);
      //   return transactionService.getSpecificUserTransaction($stateParams.id).then(function (res) {
      //     console.log(res.data);
      //     return res.data[0];
      //   });
      // },
      asdf: function ($stateParams, transactionService) {
        console.log($stateParams.id);
        return transactionService.getSpecificUserTransaction($stateParams.id).then(function (res) {
          console.log(res.data);
          return res.data[0];
        });
      },
      // asdf: function($stateParams){ //splitTransaction){
      //   return true;
      //   //return splitTransaction.stuff();
      //   // console.log('hi');
      //   // return splitTransaction.getSplitTransactions($stateParams.id)
      //   // .then(function(res){
      //   //   return res;
      //   // });
      //},
    }
  })

  .state('main.budgets', {
      cache: false,
      url: '/budgets',
      views: {
        'budgets': {
          templateUrl: 'templates/budgets.html',
          controller: 'budgetCtrl'
        }
      }
    })
    .state('main.budgetSetup', {
      cache: false,
      url: '/budgetsetup',
      views: {
        'budgets': {
          templateUrl: 'templates/budgetsetup.html',
          controller: 'budgetSetupCtrl'
        }
      }
    })
    .state('main.budgetSetupEdit', {
      cache: false,
      url: '/budgetsetupedit',
      views: {
        'budgets': {
          templateUrl: 'templates/budgetsetup-edit.html',
          controller: 'budgetSetupCtrl'
        }
      }
    })
    .state('main.profile', {
      cache: false,
      url: '/profile',
      views: {
        'profile': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('main.testview', {
      url: '/test',
      views: {
        'test': {
          templateUrl: 'templates/testview.html',
          controller: 'splitTransaction'
        }
      },
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl',
      resolve: {
        user: function (authService, $state) {
          if (authService.getCurrentUser() !== null) {
            $state.go('main');
          }
        }
      }
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl',
      resolve: {
        user: function (authService, $state) {
          if (authService.getCurrentUser() !== null) {
            $state.go('main.home');
          }
        }
      }
    });

});
