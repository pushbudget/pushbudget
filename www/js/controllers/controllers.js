angular.module('pushbudget.controllers', [])

.controller('homeCtrl', function($scope) {})

.controller('transCtrl', function($scope, $ionicSideMenuDelegate) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.transactions = [
    {
      amount: "$0.20",
      business: "7-11",
      date: "1/11/16"
    },
    {
      amount: "$34.99",
      business: "Wal-Mart",
      date: "1/10/16"
    },
    {
      amount: "$250.00",
      business: "Amazon.com",
      date: "1/10/16"
    },
    {
      amount: "$10,000",
      business: "DevMounta.in",
      date: "1/9/16"
    }
  ];
})


.controller('loginCtrl', function($scope) {})



.controller('createCtrl', function($scope) {

})


.controller('AccountCtrl', function($scope, $ionicPopup, $ionicLoading) {
  // this has to be moved to a service
  // var sandboxHandler = Plaid.create({
  //   clientName: 'pushbudget',
  //   env: 'tartan',
  //   product: 'auth',
  //   key: 'test_key',
  //   onSuccess: function(token) {
  //     window.location = '/accounts.html?public_token=' + token;
  //   }
  // });
  //
  // $scope.openLink = function() {
  //   console.log('open the link modal');
  //   sandboxHandler.open();
  // };

  console.log("Comes to the User profile screen...");

  var User = {};
  var isAnyInstitutionInactive = false;

  User.institutions = [
    {        
        InstitutionType: "bofa",
        InstitutionLogoURL: "http://placehold.it/25x25",
        AccessToken: "User's access token for bofa",
        Active: true,
        InstitutionName: "Bank Of America",
        Accounts: ["Checking *1234", "Savings *4563", "Credit *2234"]
    }, 
    {
        InstitutionType: "wells",
        InstitutionLogoURL: "http://placehold.it/25x25",
        AccessToken: "User's access token for wells",
        Active: true,
        InstitutionName: "Wells Fargo",
        Accounts: ["Checking *1234", "Savings *4563"]
    }, 
    {
        InstitutionType: "chase",
        InstitutionLogoURL: "http://placehold.it/25x25",
        AccessToken: "User's access token for chase",
        Active: false,
        InstitutionName: "Chase",
        Accounts: ["Credit *2144"]
    }
  ];

  //User.institutions = [];  //to check the scenario where the user will not have any linked accounts at the beginning.

  console.log("User:", User);



  if (User.institutions.length === 0) {
    $scope.noLinkedInstitutions = true; 
  }
  else
  {
      //check if any of the institutions need attention (if inactive)
      for (var i = 0; i < User.institutions.length; i++) {
          if (User.institutions[i].Active === false) {
              isAnyInstitutionInactive = true;
          }
      }

      if (isAnyInstitutionInactive) {
          //alert("found an inactive account");
          $ionicLoading.show({ template: 'One of more of your accounts need attention!', duration: 2500});
      }
  }

  $scope.institutions = User.institutions;

  $scope.logout = function() {
    console.log("Logout: Purge the user object in the LocalStorage...");

    $scope.data = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/logout-confirmation.html',
      title: 'Logout?',
      subTitle: 'Please confirm...',
      scope: $scope,
      buttons: [
        { text: 'Cancel', type: 'button-positive' },
        {
          text: '<b>Logout</b>',
          
          onTap: function(e) {
              console.log("Here purge the user object in the Localstorage and then call the login screen...");
              return $scope.data;            
          }
        }
      ]
    });

    //after the popup is closed, this will happen:
    myPopup.then(function(res) {
    });  
  }

  $scope.changePassword = function() {
    console.log("Change Password: Bring up the change password dialog box...");

    $scope.profile = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/change-password.html',
      title: 'Change your password',
      subTitle: 'Please enter your current password and confirm the new password.',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Change Password</b>',
          type: 'button-positive',
          onTap: function(e) {
              console.log("Current password: ", $scope.profile.currentPassword);
              console.log("New password: ", $scope.profile.newPassword);
              console.log("Confirm password: ", $scope.profile.confirmNewPassword);
              if (!$scope.profile.currentPassword || !$scope.profile.newPassword || !$scope.profile.confirmNewPassword) {
                $ionicLoading.show({ template: 'Please enter all the fields!', duration: 1500})
                e.preventDefault();  
              } 

              if ($scope.profile.currentPassword && $scope.profile.newPassword && $scope.profile.confirmNewPassword) {
                //alert("comes here");
                if ($scope.profile.currentPassword.indexOf(' ') >= 0) {
                  $ionicLoading.show({ template: 'Current Password cannot contain space(s)!', duration: 1500})
                  e.preventDefault();  
                }
                else if ($scope.profile.newPassword.indexOf(' ') >= 0) {
                  $ionicLoading.show({ template: 'New Password cannot space(s)!', duration: 1500})
                  e.preventDefault();  
                }
                else if ($scope.profile.confirmNewPassword.indexOf(' ') >= 0) {
                  $ionicLoading.show({ template: 'Confirmed Password cannot space(s)!', duration: 1500})
                  e.preventDefault();  
                }

              }

              


              if ($scope.profile.newPassword !== $scope.profile.confirmNewPassword) {
                $ionicLoading.show({ template: 'New Passwords do not match!', duration: 1500})
                e.preventDefault();  
              }              
              console.log("Here call the api to update password and pass on the user id, current password and the new password. On .then of the API call, trap any errors if the current password is incorrect and such...");
              return $scope.profile;            
          }
        }
      ]
    });

    //after the popup is closed, this will happen:
    myPopup.then(function(res) {
    });  

  }

  $scope.openPlaidLink = function() {
    console.log("Open Plaid Link: This will open up the Plaid link drop in module...");

    var sandboxHandler = Plaid.create({
     clientName: 'pushbudget',
     env: 'tartan',
     product: 'connect',
     key: 'test_key',
     onSuccess: function(token) {
       //window.location = '/accounts.html?public_token=' + token;
       //sandboxHandler.open();
       console.log("Plaid create successful with token: ", token);
     }
    });

    sandboxHandler.open();
  
   //$scope.openLink = function() {
   //  console.log('open the link modal');
    // //sandboxHandler.open();
   //};
  }

  $scope.refreshAccount = function(accessToken) {
    console.log("Refresh Account: Process to refresh account for access token:", accessToken);
  }

  $scope.deleteAccount = function(institutionName, accessToken) {
    console.log("Delete Account: Process to delete account for access token:", accessToken);


  
    $scope.data = {};
    $scope.institutionNameForDeletion = institutionName;
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/delete-account-confirmation.html',
      title: 'Delete Institution?',
      subTitle: 'Please confirm...',
      scope: $scope,
      buttons: [
        { text: 'No', type: 'button-positive' },
        {
          text: '<b>Yes</b>',
          
          onTap: function(e) {
              console.log("Call the process to delete account for access token:", accessToken);
              console.log("Only delete it from here once we get a success from Plaid on deregistration:", accessToken);
              return $scope.data;            
          }
        }
      ]
    });

    //after the popup is closed, this will happen:
    myPopup.then(function(res) {
    });  
  
  }




});
