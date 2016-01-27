
angular.module('pushbudget').controller('ProfileCtrl', function($scope, $state, $location, authService, $ionicPopup, $ionicLoading, userRef, userProfile, $ionicModal) {
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

    console.log("///////////////////Comes to the User profile screen...with the BIG user object ", userRef);

    $scope.email = userRef.email;
    var userId = userRef._id;

    console.log("///////////////////Comes to the User profile screen...with the BIG user object and UserId ", userId);


    var User = [];
    User.institutions = [];
    var isAnyInstitutionInactive = false;

    $scope.institutionNeedsAttention = false;
    $scope.institutionAttentionMessage = "";

    //Build up User.institutions based on the userRef

    for (var i = 0; i < userRef.accounts.length; i++) {
        console.log("************$$$$$$$$$$ Account name: ", userRef.accounts[i].name);
        console.log("$$$$$$$$$$ InstitutionType: ", userRef.accounts[i].institution_type);
        console.log("$$$$$$$$$$ InstitutionLogoURL: ", userRef.accounts[i].institution.logo);
        console.log("$$$$$$$$$$ AccessToken: ", userRef.accounts[i].access_token);
        console.log("$$$$$$$$$$ Active: ", userRef.accounts[i].active);
        console.log("$$$$$$$$$$ InstitutionName: ", userRef.accounts[i].institution.name);

        if (findIndexByKeyValue(User.institutions, "InstitutionType", userRef.accounts[i].institution_type) === null) {
            User.institutions.push({
                InstitutionType: userRef.accounts[i].institution_type,
                InstitutionLogoURL: userRef.accounts[i].institution.logo,
                AccessToken: userRef.accounts[i].access_token,
                Active: userRef.accounts[i].active,
                InstitutionName: userRef.accounts[i].institution.name,
                Accounts: [userRef.accounts[i].name]
            });
        }
        else {
            User.institutions[findIndexByKeyValue(User.institutions, "InstitutionType", userRef.accounts[i].institution_type)].Accounts.push(userRef.accounts[i].name);
        }
    }

    console.log("$$$$$$$$$$$$$$$$$$$$$4User.institutions", User.institutions);

    function findIndexByKeyValue(arraytosearch, key, valuetosearch) {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }


    //End of Build up User.institutions based on the userRef


    User.institutions = [{
        InstitutionType: "bofa",
        InstitutionLogoURL: "https://lh6.ggpht.com/x8OtRvnO93xdOxzbOHZ5DSSTuk92OgI0koX3nFzl5eAx1onCjZooiCUDvVRfXUeDUQ=w300",
        AccessToken: "User's access token for bofa",
        Active: true,
        InstitutionName: "Bank Of America",
        Accounts: ["Checking *1234", "Savings *4563", "Credit *2234"]
    }, {
        InstitutionType: "wells",
        InstitutionLogoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/2000px-Wells_Fargo_Bank.svg.png",
        AccessToken: "User's access token for wells",
        Active: true,
        InstitutionName: "Wells Fargo",
        Accounts: ["Checking *1234", "Savings *4563"]
    }, {
        InstitutionType: "chase",
        InstitutionLogoURL: "https://ozgeozva301.files.wordpress.com/2010/10/id_chase_1_0.jpg",
        AccessToken: "test_chase",
        Active: false,
        InstitutionName: "Chase",
        Accounts: ["Credit *2144"]
    },{
        InstitutionType: "amex",
        InstitutionLogoURL: "http://vignette4.wikia.nocookie.net/logopedia/images/c/c2/American_Express_card_logo.png/revision/latest?cb=20120526223909",
        AccessToken: "test_amex",
        Active: true,
        InstitutionName: "American Express",
        Accounts: ["Credit *10007"]
    }];



    //User.institutions = [];  //to check the scenario where the user will not have any linked accounts at the beginning.




    if (User.institutions.length === 0) {
        $scope.noLinkedInstitutions = true;
    } else {
        //check if any of the institutions need attention (if inactive)
        for (var i = 0; i < User.institutions.length; i++) {
            if (User.institutions[i].Active === false) {
                isAnyInstitutionInactive = true;
            }
        }

        if (isAnyInstitutionInactive) {
            //alert("found an inactive account");
            $scope.institutionNeedsAttention = true;
            $scope.institutionAttentionMessage = "You have unlinked accounts";

            //$ionicLoading.show({ template: 'One or more of your accounts need attention!', duration: 2500});
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
            buttons: [{
                text: 'Cancel',
                type: 'button-positive'
            }, {
                text: '<b>Logout</b>',

                onTap: function(e) {
                    console.log("Here purge the user object in the Localstorage and then call the login screen...");
                    authService.logout().then(function (res) {
                      console.log('trying to logout');
                      $scope.$emit('logout', "hey man");
                    });
                    //return $scope.data;
                }
            }]
        });

        //after the popup is closed, this will happen:
        myPopup.then(function(res) {});
    }

    $scope.changePassword = function() {
        console.log("Change Password: Bring up the change password dialog box...");

        $scope.profile = {};
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/change-password.html',
            title: 'Change your password',
            subTitle: 'Please enter your current password and confirm the new password.',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Change Password</b>',
                type: 'button-positive',
                onTap: function(e) {
                    console.log("Current password: ", $scope.profile.currentPassword);
                    console.log("New password: ", $scope.profile.newPassword);
                    console.log("Confirm password: ", $scope.profile.confirmNewPassword);
                    if (!$scope.profile.currentPassword || !$scope.profile.newPassword || !$scope.profile.confirmNewPassword) {
                        $ionicLoading.show({
                            template: 'Please enter all the fields!',
                            duration: 1500
                        })
                        e.preventDefault();
                    }

                    if ($scope.profile.currentPassword && $scope.profile.newPassword && $scope.profile.confirmNewPassword) {
                        //alert("comes here");
                        if ($scope.profile.currentPassword.indexOf(' ') >= 0) {
                            $ionicLoading.show({
                                template: 'Current Password cannot contain space(s)!',
                                duration: 1500
                            })
                            e.preventDefault();
                        } else if ($scope.profile.newPassword.indexOf(' ') >= 0) {
                            $ionicLoading.show({
                                template: 'New Password cannot space(s)!',
                                duration: 1500
                            })
                            e.preventDefault();
                        } else if ($scope.profile.confirmNewPassword.indexOf(' ') >= 0) {
                            $ionicLoading.show({
                                template: 'Confirmed Password cannot space(s)!',
                                duration: 1500
                            })
                            e.preventDefault();
                        }

                    }




                    if ($scope.profile.newPassword !== $scope.profile.confirmNewPassword) {
                        $ionicLoading.show({
                            template: 'New Passwords do not match!',
                            duration: 1500
                        })
                        e.preventDefault();
                    }
                    console.log("Here call the api to update password and pass on the user id, current password and the new password. On .then of the API call, trap any errors if the current password is incorrect and such...");
                    return $scope.profile;
                }
            }]
        });

        //after the popup is closed, this will happen:
        myPopup.then(function(res) {});

    }

    $scope.openPlaidLink = function() {
        console.log("Open Plaid Link: This will open up the Plaid link drop in module...");

        //var userId = 'testUserID123'; //get userid from scope

        var sandboxHandler = Plaid.create({
            clientName: 'pushbudget',
            env: 'tartan',
            product: 'connect',
            key: 'test_key',
            onSuccess: function(publicToken) {
                //window.location = '/accounts.html?public_token=' + token;
                //sandboxHandler.open();
                userProfile.addInstitution(userId, publicToken);
                console.log("Plaid create successful with token: ", publicToken);
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



        //var userId = 'testUserID123'; //get userid from scope

        userProfile.refreshInstitution(userId, accessToken).then(function(res) {

            var refreshHandler = Plaid.create({
                clientName: 'pushbudget',
                env: 'tartan',
                product: 'connect',
                key: 'test_key',
                token: res.data.public_token,
                onSuccess: function(newPublicToken, metadata) {

                    console.log("metadata:", metadata);
                    //userProfile.addInstitution(userId, publicToken);
                    console.log("Plaid create successful with new public token for the user which is : ", metadata.public_token);

                    //call our server endpoint to update the user's record with the new publicToken
                    userProfile.updateUserPublicTokenUponRefresh(userId, accessToken, metadata.public_token).then(function(res) {
                        console.log("Result from controller userprofile.updateUserPublicTokenUponRefresh", res);

                        //update the institution status to 'Active' for this access token
                        for (var i = 0; i < User.institutions.length; i++) {
                            if (User.institutions[i].AccessToken === res.data.access_token) {
                                //isAnyInstitutionInactive = true;
                                User.institutions[i].Active = true;
                            }
                        }

                        //this needs to be reset when all of the institutions are active
                        $scope.institutionNeedsAttention = false;
                        for (var i = 0; i < User.institutions.length; i++) {
                            if (User.institutions[i].Active === false) {
                                //isAnyInstitutionInactive = true;
                                $scope.institutionNeedsAttention = true;
                            }
                        }

                    });




                }
            });

            refreshHandler.open('chase');

        });
    }

    $scope.deleteAccount = function(institutionName, accessToken) {

        //var userId = 'testUserID123';
        var serverResponseMessage = "";




        console.log("Delete Account: Process to delete account for access token:", accessToken);



        $scope.data = {};
        $scope.institutionNameForDeletion = institutionName;
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/delete-account-confirmation.html',
            title: 'Delete Institution?',
            subTitle: 'Please confirm...',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                type: 'button-positive'
            }, {
                text: '<b>Delete</b>',

                onTap: function(e) {
                    console.log("Call the process to delete account for access token:", accessToken);
                    console.log("Only delete it from here once we get a success from Plaid on deregistration:", accessToken);

                    userProfile.deleteInstitution(userId, accessToken).then(function(res) {
                        serverResponseMessage = res.data.message;
                        console.log("From deleteAccount, server returned the message: ", res);

                        if (serverResponseMessage.toUpperCase() === "SUCCESS") {

                            for (var i = 0; i < User.institutions.length; i++) {
                                if (User.institutions[i].AccessToken === accessToken) {
                                    User.institutions.splice(i, 1);
                                }
                            }

                            if (User.institutions.length === 0) {
                                $scope.noLinkedInstitutions = true;
                                $scope.institutionNeedsAttention = false;
                            }

                            //check if any institutions need attention
                            $scope.institutionNeedsAttention = false;
                            for (var i = 0; i < User.institutions.length; i++) {
                                if (User.institutions[i].Active === false) {
                                    //isAnyInstitutionInactive = true;
                                    $scope.institutionNeedsAttention = true;
                                }
                            }


                        }

                    });




                    return $scope.data;
                }
            }]
        });

        //after the popup is closed, this will happen:
        myPopup.then(function(res) {});

    }



    $scope.user.userOptions.animateChart = false;

    $ionicModal.fromTemplateUrl('templates/profile-editoptions.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
    $scope.modal.remove();
    });
    // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
    // Execute action
    });
    // Execute action on remove modal
      $scope.$on('modal.removed', function() {
    // Execute action
    });



});
