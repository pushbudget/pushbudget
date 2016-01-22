angular.module('pushbudget').service('userProfile', function ($http, $q) {

  // transaction split view, if no splits...transaction is added to bucket.
  // if there are splits, the parent transaction is not added and 
  // only the child transctions, aka shadow or split, are added
  // to the subbudget splits array

  this.removeInstitution = function (accessToken) {
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3001/api/split/' + transaction.transId,
      data: transaction
    }).then(function (bucket) {
      
    }).catch(function (err) {
      
    });
    return dfd.promise;
  }

   this.addInstitution = function (userId, publicToken) {
    
    $http({
      method: 'POST',
      url: 'http://3c541816.ngrok.io/api/authenticate/' + userId,
      data: {public_token : publicToken}
    }).then(function (res) {
    	console.log("Result from addInstitution:", res);
       return res;
    }).catch(function (err) {
    	console.log("Error from addInstitution:", err);
      	return err;
    });
    
  }

    this.refreshInstitution = function (userId, accessToken) {

    	console.log("Comes in the refreshInstitution service...")

    	var dfd = $q.defer();

    	//get user's publictoken given the userId and accesstoken (which is unique to the institution for the user)

		    $http({
		      method: 'GET',
		      url: 'http://3c541816.ngrok.io/api/token/' + accessToken + '/user/' + userId
		      
		    }).then(function (res) {
		    	console.log("Result from refreshInstitution/get user's public token:", res.data.public_token);
		        dfd.resolve(res);




		    }).catch(function (err) {
		    	console.log("Error from refreshInstitution/get user's public token:", err);
		      	dfd.reject(err);
		    });
		    
		    return dfd.promise;
	}

    this.updateUserPublicTokenUponRefresh = function (userId, accessToken, newPublicToken ) {

    	var dfd = $q.defer();

    	//get user's publictoken given the userId and accesstoken (which is unique to the institution for the user)

		    $http({
		      
		      method: 'PATCH',
      			url: 'http://3c541816.ngrok.io/api/authenticate/' + userId + '/refresh/' + accessToken,
      			data: {public_token : newPublicToken}
		      
		    }).then(function (res) {
		    	console.log("Result from updateUserPublicTokenUponRefresh:", res);
		        dfd.resolve(res);




		    }).catch(function (err) {
		    	console.log("Error from updateUserPublicTokenUponRefresh:", err);
		      	dfd.reject(err);
		    });
		    
		    return dfd.promise;
	}
	

	this.deleteInstitution = function (userId, accessToken ) {

    	var dfd = $q.defer();

    	//get user's publictoken given the userId and accesstoken (which is unique to the institution for the user)

		    $http({
		      
		      method: 'DELETE',
      			url: 'http://3c541816.ngrok.io/api/user/plaid/' + accessToken + '/' + userId      			
		      
		    }).then(function (res) {
		    	console.log("Result from deleteInstitution:", res);
		        dfd.resolve(res);




		    }).catch(function (err) {
		    	console.log("Error from deleteInstitution:", err);
		      	dfd.reject(err);
		    });
		    
		    return dfd.promise;
	}

});