// Push Budget

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('pushbudget', ['ionic', 'ionic.service.core', 'pushbudget.controllers', 'chart.js', 'ionic.service.push', 'ui.router'])

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
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl',
    resolve: {
      userRef: function (authService, $state, userService, $stateParams) {
        if (authService.getCurrentUser() === null) {
          $state.go('login');
        }
        var userId = authService.getCurrentUser()._id;
        console.log(userId);
        return userService.getUserFromDb(userId).then(function (res) {
          return res.data;
        });
      },
    },
  })

  // Each tab has its own nav history stack:

  .state('main.home', {
      url: '/home',
      views: {
        'home': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      },
    })
    .state('main.trans', {
      url: '/trans',
      views: {
        'transactions': {
          templateUrl: 'templates/transactions.html',
          controller: 'transCtrl'
        },
      }
    })
    .state('main.newTrans', {
      url: '/newtrans',
      views: {
        'transactions': {
          templateUrl: 'templates/newtransaction.html',
          controller: 'newtransctrl'
        }
      }
    })
    .state('main.budgets', {
      url: '/budgets',
      views: {
        'budgets': {
          templateUrl: 'templates/budgets.html',
          controller: 'budgetCtrl'
        }
      }
    })
    .state('main.budgetSetup', {
      url: '/budgetsetup',
      views: {
        'budgets': {
          templateUrl: 'templates/budgetsetup.html',
          controller: 'budgetSetupCtrl'
        }
      }
    })
    .state('main.budgetSetupEdit', {
      url: '/budgetsetupedit',
      views: {
        'budgets': {
          templateUrl: 'templates/budgetsetup-edit.html',
          controller: 'budgetSetupCtrl'
        }
      }
    })
    .state('main.profile', {
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
            $state.go('main.home');
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
            $state.go('home')
          }
        }
      }
    })

});