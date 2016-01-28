angular.module('pushbudget').service('userDataService', function (userService, transactionService, subbudgetService, budgetTransaction, $q) {
  var that = this;
  this.updateData = function(userId){
    return $q(function(resolve, reject){
      var user;
      userService.getUserFromDb(userId)
      .then(function(res){
        user = res.data;
      }).then(function(){
        return transactionService.getAllUserUntagged(userId);
      }).then(function(untagged){
        resolve(that.getUserData(user, untagged.data));
      }).catch(function(err){
        console.log(err);
        reject(err);
      });
    });
  };

  this.globalUpdate = function(dataObj){
    var userObj = {

      untaggedSum: untaggedSum,
      totalSpent: sumObj.totalSum + untaggedSum,
      totalBudget: userRef.budget.amount,
      totalAllocated: sumObj.totalAllocated,
      unallocated: userRef.budget.amount - userRef.savings - sumObj.totalAllocated,
      savings: userRef.budget.savings,
      subbudgetArr: sumObj.subbudgets.slice(),
      untaggedArr: untaggedRef.slice(),
      useableBudget: userRef.budget.amount - userRef.savings,
      remaining: (userRef.budget.amount - userRef.savings) - (sumObj.totalSum + untaggedSum),
    };

  };

  this.updateInitVals = function(budgetArr,totalBudget){
    for (var i = 0; i < budgetArr.length; i++){
      budgetArr[i].initVal = (budgetArr[i].allocated/totalBudget)*100;
    }
    return budgetArr;
  };

  //saves settings to the db, returns a promise with true/false upon completion
  this.writeChangesToDb = function(dataObj){
    var success = false;
    return $q(function(resolve,reject){
      //delete the deleted categories from the db:
      var deleteLoop = function(idx){
        if (idx < dataObj.deleteArr.length){
          subbudgetService.deleteBucket(dataObj.deleteArr[idx]._id, dataObj.user.budgetId)
          .then(function(){
            deleteLoop(idx+1);
          }).catch(function(err){
            console.log(err);
            return;
          });
        }
      };
      deleteLoop(0);

      //update the budget array on the db:
      var updateDbBudgetArr = function(idx){
        //create new categories on db:
        if (idx < dataObj.currentSettings.categories.length){
          if(dataObj.currentSettings.categories[idx].new){
            var newCategory = {
              budget: dataObj.user.budgetId,
              category: dataObj.currentSettings.categories[idx].category,
              allocated: parseFloat(dataObj.currentSettings.categories[idx].allocated),
              color: dataObj.currentSettings.categories[idx].color,
            };
            subbudgetService.createBucket(newCategory)
            .then(function(res){
              dataObj.currentSettings.categories.splice(idx,1,res.data);
              updateDbBudgetArr(idx+1);
            }).catch(function(err){
              console.log(err);
              return;
            });
          }else{ //if it is not new, update its new value:
            subbudgetService.editBucket(dataObj.currentSettings.categories[idx]._id, dataObj.currentSettings.categories[idx])
            .then(function(res){
              updateDbBudgetArr(idx+1);
            }).catch(function(err){
              console.log(err);
              return;
            });
          }
        }else{ //now update the budget property on the db:
          var output ={
            _id: dataObj.user.budgetId,
            amount: dataObj.currentSettings.budget,
            savings: dataObj.currentSettings.savings,
            sum: dataObj.totalAllocated,
            subbudgets: dataObj.currentSettings.categories
          };
          budgetTransaction.editBudget(output).then(function(budget){
            //the db should be updated now
            success = true;
            resolve(success);
          }).catch(function(err){
            console.log(err);
            reject(success);
          });
        }
      };
      updateDbBudgetArr(0);
      // subbudgetService.getAllBuckets(user.userId).then(function(result){
      // });
    });
  };

  this.getDecimals = function(int){
    if (!int){
      int = 0;
    }
    return parseFloat(int).toFixed(2);
  };

  this.calcSums = function(budgetArr, budgetAmount){
    var totalSum = 0;
    var totalAllocated = 0;
    for (var i = 0; i < budgetArr.length; i++){
      var sum = 0;
      for (var j = 0; j < budgetArr[i].transactions.length; j++){
        sum += budgetArr[i].transactions[j].amount;
      }
      for (j = 0; j < budgetArr[i].splits.length; j++){
        sum += budgetArr[i].splits[j].amount;
      }
      totalAllocated += budgetArr[i].allocated;
      budgetArr[i].sum = sum;
      totalSum += sum;
      budgetArr[i].goodData = true;
      budgetArr[i].initVal = (budgetArr[i].allocated/budgetAmount)*100;
    }
    return {
      subbudgets: budgetArr,
      totalSum: totalSum,
      totalAllocated: totalAllocated,
    };
  };

  this.calcUntaggedSum = function(untaggedArr){
    var sum =0;
    for (var i = 0; i < untaggedArr.length; i++){
      sum += untaggedArr[i].amount;
    }
    return sum;
  };

  this.getUserData = function(userRef, untaggedRef){
    var sumObj = that.calcSums(userRef.budget.subbudgets, userRef.budget.amount);
    var untaggedSum = that.calcUntaggedSum(untaggedRef);
    var userObj = {
      userId: userRef._id,
      budgetId: userRef.budget._id,
      untaggedSum: untaggedSum,
      totalSpent: sumObj.totalSum + untaggedSum,
      totalBudget: userRef.budget.amount,
      totalAllocated: sumObj.totalAllocated,
      unallocated: userRef.budget.amount - userRef.savings - sumObj.totalAllocated,
      savings: userRef.budget.savings,
      subbudgetArr: sumObj.subbudgets.slice(),
      untaggedArr: untaggedRef.slice(),
      useableBudget: userRef.budget.amount - userRef.savings,
      remaining: (userRef.budget.amount - userRef.savings) - (sumObj.totalSum + untaggedSum),
      email: userRef.email,
      userName: userRef.userName,
      userOptions: {
        animateChart: false, //need to make this a property on the db schema
      },
    };
    return userObj;
  };



});
