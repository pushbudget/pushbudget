'use strict';
//libraries and plugins
let plaid = require('plaid'),
  gcm = require('node-gcm'),
  express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  fs = require('fs'),
  environment = "development",
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bCrypt = require('bcrypt-nodejs'),
  flash = require('connect-flash'),
  mongoo = require("./mongoose.js"),
  q = require("q"),
  apn = require("apn"),
  plaidClient = {},

  //models controllers etc.
  Subbudget = require('./models/subbudget.model'),
  User = require("./models/user.model.js"),
  Budget = require("./models/budget.model.js"),
  SubBudget = require("./models/subbudget.model.js"),
  Account = require("./models/account.model.js"),
  Webhook = require("./models/webhook.model.js"),
  RegToken = require("./models/registrationtoken.model.js"),
  Transaction = require("./models/transaction.model.js"),
  Tokens = require("./models/tokens.model.js"),
  Blob = require("./models/blob.model.js"),
  Institution = require("./models/institution.model.js"),
  SplitTransaction = require("./models/splittransaction.model.js"),
  Device = require("./models/device.model.js"),
  userCtrl = require("./controllers/user.server.controller.js"),
  authCtrl = require("./controllers/auth.server.controller.js"),
  secrets, cert, apnkey,


  // configs and application
  plaid_env = plaid.environments.tartan,
  app = express(),
  db = mongoo.db();

/*fs.readFile("cert.pem", (err,data)=>{
  cert = data
})
fs.readFile("key.pem", (err,data)=>{
  apnkey = data
})*/
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  console.log('case 11111');
  secrets = require("./herokuConfig.js");
  console.log(secrets)
} else {
  console.log('case 22222');
  secrets = require("./secrets.js");
}

db.connection.once('open', () => {
  console.log('Db is connected')
})

let plaidTestUser = {}
if (environment === 'test') {
  plaidClient = new plaid.Client("test_id", "test_secret", plaid_env);
}
if (environment === 'development') {
  plaidClient = new plaid.Client(secrets.secrets.client_id, secrets.secrets.secret, plaid_env);
}
//GCM Push Notification Test
let pushyMessage = new gcm.Message();
pushyMessage.addNotification({
  title: 'PushBudget',
  body: 'You just got served.',
  icon: 'ic_launcher'
})

function messageAssembler(body, regToken) {
  let newMessage = new gcm.Message();
  newMessage.addNotification({
    title: 'PushBudget',
    body: body,
    icon: 'ic_launcher'
  })
  sender.sendNoRetry(newMessage, {
    registrationTokens: [regToken]
  }, (err, res) => {
    (err) ? console.error(err): console.log(res)
  })
}

let sender = new gcm.Sender(secrets.secrets.gcm_key)
  /*let apnOptions = {
    cert: cert,
    key: apnkey,
    production: false
  }
  let apnConnection = new apn.Connection(apnOptions);
  let myDevice = new apn.Device("0b6abb931ec919d435a76608e4b569fce3efcb210caec470009e71720a4c53fe");
  let note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 3;
  note.sound = "ping.aiff";
  note.alert = "\uD83D\uDCE7 \u2709 Hey George";
  note.payload = {'messageFrom': 'PushBudget'};

  app.post('/apntest', (req, res)=>{
    console.log("TESTING APN")
    apnConnection.pushNotification(note, myDevice);
  })

  apnConnection.on("connected", ()=>{
    console.log("Connected");
  })

  apnConnection.on("transmitted", (note, device)=>{
    console.log(`Notification transmitted to ${device.token.toString("hex")}`)
  })

  apnConnection.on("transmissionError", (err, note, device)=>{
    console.log('NOTE', note)
    console.log('DEVICE', device.token.toString("hex"))
    console.log("we got an error", err)
  })

  apnConnection.on("timeout", ()=>{
    console.log("Connection timeout");
  })

  apnConnection.on("disconnected", ()=>{
    console.log("disconnected")
  })

  apnConnection.on("socketError", console.error);

  let fbOptions = {
      "batchFeedback": true,
      "interval": 300
  }

  let feedback = new apn.Feedback(fbOptions);
    feedback.on("feedback", (devices)=>{
      devices.forEach((item)=> {
          console.log(item)
      });
  });*/

function subBudgetSum(sbref) {
  var dfd = q.defer();
  SubBudget.findById(sbref).deepPopulate(['transactions', 'splits']).exec().then((sb) => {
    var tot = sb.transactions.reduce(function (total, transaction) {
      return total + transaction.amount
    }, 0) + sb.splits.reduce(function (total, split) {
      return total + split.amount
    }, 0)
    dfd.resolve(tot)
  })
  return dfd.promise;
}

function subBudgetSumUpdate(sbref) {
  subBudgetSum(sbref).then(function (tot) {
    SubBudget.findByIdAndUpdate(sbref, {
      sum: tot
    }, {
      new: true
    }).then(
      (sub) => console.log(sub)
    )
  })
}

function sumBudget(budgetref) {
  var dfd = q.defer()
  Budget.findById(budgetRef).deepPopulate(['subbudgets']).exec().then(
    (budget) => {
      return budget.subbudgets.reduce((tot, sub) => {
        return tot += sub.sum
      }, 0)
    }
  )
}




function budgetSum(budgetref) {
  Budget.findById(budgetref).exec().then((budget) => {
    let promises = budget.subbudgets.map(function (sbref) {
      return subBudgetSum(sbref)
    })
    q.all(promises).done((hey) => {
      console.log(hey);
      return hey
    })
  })
}

function updatePassword(password, userId) {
  var dfd = q.defer()
  var hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  User.findByIdAndUpdate(userId, {
    userPassword: hash
  }, {
    new: true
  }).exec().then(
    (user) => {
      dfd.resolve(user)
    }
  )
  return dfd.promise;
}



// endpoint for adding banks via plaid
app
  .use(cors())
  .use(bodyParser.json())
  .use(express.static(__dirname))
  .use(session({
    secret: 'something'
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash())
  .post('/app/regtoken', (req, response) => {
    let token = new RegToken({
      token: req.body.token,
      user: req.body.user
    })
    token.save().then(function (doc) {
      response.json(doc)
    })
  })
  //GCM Push Notification Test endpoint
  .post('/gcm', (req, response) => {
    let meanMessage = new gcm.Message();
    meanMessage.addNotification({
      title: 'PushBudget',
      body: req.body.message,
      icon: 'ic_launcher'
    })
    sender.sendNoRetry(meanMessage, {
      registrationTokens: ['cPccdlz7JbU:APA91bE53PH5CIugwV8OddfosOYxvjSqXQ8rqi9v2JcYk3hxCo3BzPuO7K9sNVCrJ9omWYvSkkVKT_Nrg8sK9okkBEVKE8qihiqUwSs8syoA9-YuNhAZVKMYH9rtlcP9Zg58ypNCDq7X']
    }, (err, res) => {
      (err) ? console.error(err): response.json(meanMessage)
    })
  })
  //GCM Push Registration Webhook
  .post('/gcmhook', (req, response) => {
    console.log('hook was hit!')
    console.log(req.body)
    if (req.body._push) {
      if (req.body._push.android_tokens && req.body.unregister === false) {
        let blob = new Blob({
          blob: req.body
        })
        blob.save()
        response.status(200).json({
          message: 'android'
        })
      } else if (req.body._push.ios_tokens && req.body.unregister === false) {
        let blob = new Blob({
          blob: req.body
        })
        blob.save()
        console.log(req.body)
        response.status(200).json({
          message: 'ios'
        })
      } else if (req.body._push.android_tokens && req.body.unregister === true) {
        let blob = new Blob({
          blob: req.body
        })
        blob.save()
        console.log(req.body)
        response.status(200).json({
          message: 'deregister android'
        })
      } else if (req.body._push.ios_tokens && req.body.unregister === true) {
        let blob = new Blob({
          blob: req.body
        })
        blob.save()
        console.log(req.body)
        response.status(200).json({
          message: 'deregister ios'
        })
      }
    } else if (req.body.token_invalid) {
      let blob = new Blob({
        blob: req.body
      })
      blob.save()
      console.log(req.body)
      response.status(200).json({
        message: 'token invalid'
      })
    } else {
      let blob = new Blob({
        blob: req.body
      })
      blob.save()
      console.log("What are you trying to pull, google?")
      response.status(204)
    }
  })
  //Pushbudget-facing authentication endpoint
  .post('/api/authenticate/:userid', (req, response) => {
    let public_token = req.body.public_token;
    let tokens = new Tokens({
      user: req.params.userid,
      public_token: public_token,
      institution_type: ''
    })
    plaidClient.exchangeToken(public_token, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log('RES', res)
        tokens.access_token = res.access_token;
        tokens.save()
        response.json({
          message: "User added!"
        })
      }
    })
  })
  .patch('/api/authenticate/:userid/refresh/:access_token', (req, response) => {
    plaidClient.exchangeToken(req.body.public_token, (err, res) => {
      Tokens.findOneAndUpdate({
        user: req.params.userid,
        access_token: req.params.access_token
      }, {
        public_token: req.body.public_token,
        access_token: res.access_token
      }, {
        new: true
      }).exec().then(
        (token) => {
          response.json(token)
        }
      )
    })
  })

// break out into user routes/controllers
.get('/users/all', (req, response) => {
    User.find((err, res) => {
      response.json(res)
    })
  })
  .get('/user/:id/populate', (req, response) => {
    return userCtrl.populateUser(req, response);
  })
  // grab all users from database
  .get('/users/all', (req, response) => {
    User.find((err, res) => {
      response.json(res)
    })
  })
  .patch('/user/:id', (req, response) => {
    User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec((err, doc) => {
      response.json(doc)
    })
  })
  .patch('/user/:id/password', (req, response) => {
    checkHash(req.body.currentPassword, id).then(
      (valid) => {
        !valid ? response.json({
          message: "That password is invalid"
        }) : updatePassword(req.body.newPassword, id).then(
          (user) => {
            response.json(user)
          }
        )
      }
    )
  })

//
//
.get('/api/token/:access_token/user/:userId', (req, response) => {
    Tokens.findOne({
      access_token: req.params.access_token,
      user: req.params.userId
    }).exec().then(
      (tokens) => {
        response.json(tokens)
      }
    )
  })
  .get('/plaidTransactions/:id', (req, response) => {
    Tokens.findOne(req.params.id).exec((err, res) => {
      console.log("about to plaid..", req.params.id);
      if (err) {
        response.json('What are you doing?')
      } else {
        plaidClient.getConnectUser(res.access_token, {
          "pending": true
        }, (err, res2) => {
          response.json(res2)
        })
      }
    })
  })
  .delete('/api/user/plaid/:access_token/:userid', (req, response) => {
    console.log(req.params.access_token)
    console.log(req.params.userid)
      //DO NOT ACTIVATE UNTIL PRODUCTION
      // plaidClient.deleteConnectUser(req.params.access_token, (err, res) => {
      //   console.log(res)
      //   Accounts.remove({
      //     user: req.params.userid
      //   }, (err) => {
      //     err ? console.log(err) : response.json({message: 'SUCCESS'})
      //   })
      // })
    response.json({
      message: `SUCCESS`
    })
  })
  .post('/user/', (req, response) => {

  })
  .patch('/user/webhook/:id', (req, response) => {
    User
      .findById(req.params.id)
      .exec((err, doc) => {
        console.log("about to plaid..", req.params.id);
        if (err) {
          response.json('What are you doing?')
        } else {
          plaidClient.patchConnectUser(doc.access_token, {}, {
            webhook: 'http://warm-inlet-29190.herokuapp.com/webhook',
          }, function (err, mfaResponse, respo) {
            response.json(respo);
          })
        }
      })
  })
  .post('/webhook', (req, response) => {
    console.log('WEBHOOK ACTIVATED')
    var webhook = new Webhook({
      total_transactions: req.body.total_transactions || 0,
      code: req.body.code,
      message: req.body.message,
      resolve: req.body.resolve || 'Not an error',
      access_token: req.body.access_token || '0',
    })
    webhook.save()
    switch (req.body.code) {
    case 0:
      console.log('INITIAL TRANSACTION PULL')
      let idToSearch = ''
      console.log(req.body.access_token)
      Tokens.find({
        access_token: req.body.access_token
      }).exec((err, res) => {
        console.log(err)
        plaidClient.getConnectUser(req.body.access_token, {
          "pending": true
        }, (err, res2) => {
          Tokens.findByIdAndUpdate(res[0]._id, {
            institution_type: res2.accounts[0].institution_type,
            lastPull: Date.now()
          }, {
            new: true
          }).exec((err, res) => {
            console.log(res)
          })
          res2.accounts.map((account) => {
            Institution.find({
              institution_type: account.institution_type
            }).exec().then((institution) => {
              let newAccount = new Account({
                user: res[0].user,
                institution_type: account.institution_type,
                institution: institution._id,
                name: `${account.meta.official_name} *${account.meta.number}`,
                type: account.type,
                digits: account.meta.number,
                subtype: account.subtype || '',
                access_token: req.body.access_token
              })
              newAccount.save((err, doc) => {
                User.findByIdAndUpdate(doc.user, {
                  $addToSet: {
                    accounts: doc._id,
                  }
                }).exec()
              })
            })
          })
          res2.transactions.map((transaction) => {
            let cat = ''
            if (transaction.category) {
              cat = transaction.category
            }
            if (transaction.amount >= 0) {
              let newTrans = new Transaction({
                user: res[0].user,
                name: transaction.name,
                account: transaction._account,
                amount: transaction.amount,
                plaid_id: transaction._id,
                posted: transaction.date,
                category: cat
              })
              console.log(newTrans)
              newTrans.save()
            }
          })
          RegToken.find({
            user: res[0].user
          }).exec((err, regToken) => {
            console.log(res[0]._id)
            console.log(regToken)
            messageAssembler("Welcome to Pushbudget! Don't forget to tag your transactions!", regToken[0].token)
          })
        })
      })
      break;
    case 1:
      console.log('HISTORICAL TRANSACTION PULL')
      break
    case 2:
      console.log('NORMAL TRANSACTION PULL')
      Tokens.find({
        access_token: req.body.access_token
      }).exec((err, res) => {
        plaidClient.getConnectUser(req.body.access_token, {
          "pending": true,
          "gte": res[0].lastPull
        }, (err, res2) => {
          console.log(res[0].lastPull)
          if (res2.transactions.length > 0) {
            res2.transactions.map((transaction) => {
              let cat = ''
              if (transaction.category) {
                cat = transaction.category
              }
              if (transaction.amount >= 0) {
                let newTrans = new Transaction({
                  user: res[0].user,
                  name: transaction.name,
                  account: transaction._account,
                  amount: transaction.amount,
                  plaid_id: transaction._id,
                  posted: transaction.date,
                  category: cat
                })
                console.log(newTrans)
                newTrans.save()
              }
            })
            Tokens.findByIdAndUpdate(res[0]._id, {
              lastPull: Date.now()
            }, {
              new: true
            }).exec().then(
              (doc) => {
                console.log(doc)
                response.json({
                  message: `${res2.transactions.length} new transactions...`
                })
                RegToken.find({
                    user: res[0].user
                  }).exec((err, regToken) => {
                    console.log(res[0]._id)
                    console.log(regToken)
                    messageAssembler(`${res2.transactions.length} new transactions...`, regToken[0].token)
                  })
                  //add push transaction update here
              })
          } else {
            Tokens.findByIdAndUpdate(res[0]._id, {
              lastPull: Date.now()
            }, {
              new: true
            }).exec().then(
              (doc) => {
                console.log(doc)
                response.json({
                  message: `No new transactions, Plaid. What are you thinking...`
                })
              }).catch(
              (err) => console.log(err)
            )
          }
        })
      })
      break
    case 3:
      console.log('REMOVED TRANSACTION')
      req.body.removed_transactions.map((transaction_id) => {
        deepEraseTrans(transaction_id);
      })
      Tokens.find({
        access_token: req.body.access_token
      }).exec().then(
        (tokens) => {
          RegToken.find({
            user: tokens[0].user
          }).exec((err, regToken) => {
            console.log(regToken)
            messageAssembler(`${req.body.removed_transactions.length} transactions were deleted by your institution...`, regToken[0].token)
          })
        })
      response.json({
        "message": "We deleted what you told us to."
      })
      break
    case 4:
      console.log('WEBHOOK UPDATED')
      break
    case 1215:
      console.log("Plaid can no longer access the user's account.")
      Account.update({
        access_token: req.body.access_token
      }, {
        $set: {
          active: false
        }
      }, {
        multi: true
      }).exec().then(
        (accounts) => {
          console.log(accounts)
          Tokens.find({
            access_token: req.body.access_token
          }).exec().then(
            (token) => {
              console.log(token)
              RegToken.findOne({
                user: token[0].user
              }).exec().then(
                (regToken) => {
                  console.log(regToken)
                  messageAssembler("Your banking credentials are no longer valid. Please re-link through PushBudget.", regToken.token)
                  response.json({
                    "message": "That bank is kaput."
                  })
                }
              )
            }
          )
        }
      )

      break
    case 1205:
      console.log("The account is locked. Please check with your financial institution, then re-link through PushBudget.")
      Account.update({
        access_token: req.body.access_token
      }, {
        $set: {
          active: false
        }
      }, {
        multi: true
      }).exec().then(
        (accounts) => {
          console.log(accounts)
          Tokens.find({
            access_token: req.body.access_token
          }).exec().then(
            (token) => {
              console.log(token)
              RegToken.findOne({
                user: token[0].user
              }).exec().then(
                (regToken) => {
                  console.log(regToken)
                  messageAssembler("Your account has been locked. Please check with your financial institution, then re-link through PushBudget.", regToken.token)
                  response.json({
                    "message": "The institution has locked this account."
                  })
                }
              )
            }
          )
        }
      )
      break;
    default:
      console.log('SOME SORT OF ERROR', req.body.code, req.body.message)
      break
    }
  })


// transaction endpoints

// get all transactions for particular user
app.get('/api/transactions/user/:userId', function (req, res) {
  Transaction.find({
    user: req.params.userId
  }).exec().then(function (transactions) {
    res.status(200).send(transactions);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

// get a specific transaction based off of transaction id
app.get('/api/transactions/:transId', function (req, res) {
  Transaction.find({
    _id: req.params.transId
  }).exec().then(function (transaction) {
    res.status(200).send(transaction);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

// edit a specific transaction and then return that updated transaction via new: true
app.patch('/api/transactions/:transid', (req, res) => {
  console.log(req.body);
  Transaction.findByIdAndUpdate(req.params.transId, req.body, {
    new: true
  }).exec().then(function (transaction) {
    res.status(201).send(transaction);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

app.post('/api/institution', (req, res) => {
  let institution = new Institution({
    name: req.body.name,
    products: req.body.products,
    logo: req.body.logo,
    colors: req.body.colors,
    plaid_id: req.body.plaid_id,
    institution_type: req.body.institution_type,
  })
  institution.save((err, doc) => {
    res.json(doc)
  })
})

function deleteSplit(splitRef) {
  SplitTransaction.remove({
    _id: splitRef
  }).exec().then(
    (split) => {
      console.log(split)
    }
  )
}

function deleteTrans(transRef) {
  Transaction.remove({
    _id: transRef
  }).exec().then(
    (trans) => {
      console.log(trans)
    }
  )
}

function findTransaction(transId) {
  var dfd = q.defer()
  console.log('finding trans')
  Transaction.findById(transId).exec().then(
    (trans) => {
      dfd.resolve(trans)
    }
  )
  return dfd.promise
}

function findSplits(transId) {
  var dfd = q.defer()
  console.log('finding splits')
  console.log(transId)
  SplitTransaction.find({
    transaction: transId
  }).exec().then(
    (splits) => {
      console.log("SPLITS", splits)
      console.log("RESOLVING SPLITS")
      dfd.resolve(splits)
    }
  )
  return dfd.promise
}

function findSplitsAndPopulate(transId) {
  var dfd = q.defer()
  console.log('finding splits')
  console.log(transId)
  SplitTransaction.find({
    transaction: transId
  }).populate('transaction').exec().then(
    (splits) => {
      console.log("SPLITS", splits)
      console.log("RESOLVING SPLITS")
      dfd.resolve(splits)
    }
  )
  return dfd.promise
}

function findUser(userId) {
  var dfd = q.defer()
  console.log('finding user')
  User.findById(userId).exec().then(
    (user) => {
      dfd.resolve(user)
    }
  )
  return dfd.promise
}

function findBudget(budgetId) {
  var dfd = q.defer()
  console.log('finding budget')
  Budget.findById(budgetId).populate('subbudgets').exec().then(
    (budget) => {
      dfd.resolve(budget)
    }
  )
  return dfd.promise
}

function findSubBudgets(budget) {
  return budget.subbudgets.map((sub) => {
    return sub
  })
}

function findTransInSubAndDelete(sub, transid) {
  console.log("SUB", sub)
  console.log("TRANS", transid)
  let present = sub.transactions.indexOf(transid)
  present === -1 ? false : SubBudget.findByIdAndUpdate(sub._id, {
    $pull: {
      transactions: transid
    }
  }).exec(
    (trans) => {
      console.log('IM DELETING A TRANSACTION')
      deleteTrans(transid)
    }
  )
}

function findSplitsInSubAndDelete(sub, split) {
  let present = sub.splits.indexOf(split._id)
  present === -1 ? false : SubBudget.findByIdAndUpdate(sub._id, {
    $pull: {
      splits: split._id
    }
  }).exec(
    (split) => {
      console.log('IM DELETING A SPLIT TRANSACTION')
      deleteSplit(split._id)
      deleteTrans(split.transaction)
    }
  )
}

function deepEraseTrans(transaction) {
  console.log("IT BEGINS")
  let userid;
  let splitsColl = [];
  let transey;
  findTransaction(transaction)
    .then(
      (transaction, err) => {
        console.log(transaction);
        console.log("YOU MADE IT TO FIND TRANSACTION")
        userid = transaction.user
        transey = transaction
        return findSplits(transaction._id)
      }
    ).then(
      (splits) => {
        console.log("YOU MADE IT TO FINDSPLITS")
        console.log(userid)
        if (!splits.length) {
          console.log("No SPLITS")
        } else if (splits.length) {
          console.log("THESE ARE SPLITS", splits)
          transey = ''
          splitsColl = splits;
        }
        return findUser(userid)
      }
    ).then(
      (user) => {
        console.log("YOU MADE IT TO FIND USER")
        return findBudget(user.budget)
      }
    ).then(
      (budget) => {
        var dfd = q.defer()
        console.log("YOU MADE IT TO FIND SUBBUDGET")
        console.log("SUBBUDGETS", findSubBudgets(budget))
        dfd.resolve(findSubBudgets(budget))
        return dfd.promise
      }
    ).then((subs) => {
      subs.forEach(
        (sub) => {
          console.log("WE'RE FOR EACHING")
          console.log(transey)
          if (transey) {
            console.log("There is a transaction, and this is it:", transey)
            findTransInSubAndDelete(sub, transey._id)
          } else if (splitsColl) {
            console.log("THERE ARE SPLITS WHAT")
            splitsColl.forEach((split) => {
              console.log("gonna delete")
              findSplitsInSubAndDelete(sub, split)
            })
          }
        })
    })
}




// delete a specific transaction and then return an empty object on success
//TODO
app.delete('/api/transactions/:transId', (req, res) => {
  deepEraseTrans(req.params.transId);
  res.status(204).send();
});

// get untagged transactions specific to user
app.get('/api/transactions/untagged/:userId', function (req, res) {
  Transaction.find({
    user: req.params.userId,
    tagged: false
  }).exec().then(function (transactions) {
    res.status(200).send(transactions);
  }).catch(function (err) {
    res.status(500).send(err);
  });
})

// subbudget "bucket" endpoints

// get a specific subbudget based off of id, these are tied to a user
app.get('/api/subbudget/:id', function (req, res) {
  Subbudget.find({
    _id: req.params.id
  }).exec().then(function (subbudget) {
    if (subbudget.length === 0) {
      res.status(204).send(subbudget);
    }
    res.status(200).send(subbudget);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

app.get('/api/splits/:transactionId', (req, res)=>{
  findSplitsAndPopulate(req.params.transactionId).then(
    (splits)=>{
      res.json(splits)
    }
  )
})

//get just subbudgets for a particular user
app.get('/api/user/subbudget/:id', function (req, res) {
  User.findById(req.params.id).deepPopulate(['budget', 'budget.subbudgets']).exec().then(function (user) {
    res.json(user.budget.subbudgets);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

// edit a specific subbuget and return that newly edited subbuget
app.patch('/api/subbudget/:id', function (req, res) {
  Subbudget.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }).exec().then(function (subbudget) {
    res.status(201).send(subbudget);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

// create a new subbudget specific to the user and users budget
app.post('/api/subbudget/:budgetId', function (req, res) {
  var newSubbudget = new Subbudget(req.body);
  newSubbudget.save().then(function (subbudget) {
    Budget.findByIdAndUpdate(req.params.budgetId, {
      $addToSet: {
        subbudgets: subbudget._id
      }
    }, {
      new: true
    }).exec().then(function (budget) {
      console.log(budget);
    }).catch(function (err) {
      res.status(500).send(err);
    });
    res.status(201).send(subbudget);
  }).catch(function (err) {
    console.log(err);
    res.status(500).send(err);
  });
});

// delete a subbudget specific to the user and users budget
app.delete('/api/subbudget/:subbudgetId/:budgetId', function (req, res) {
  Subbudget.findById(req.params.subbudgetId).exec().then(function (subbudget) {
    var targetTransaction;
    subbudget.transactions.forEach(function (transaction, index) {
      Transaction.findByIdAndUpdate(transaction, {
        tagged: false
      }).exec().then(function (transaction) {
        console.log('yay');
      }).catch(function (err) {
        console.log('error', err);
        res.status(500).send(err);
      });
    });
    subbudget.splits.forEach(function (split, index) {
      SplitTransaction.findById(split).exec().then(function (thesplit) {
        SplitTransaction.remove({
          transaction: thesplit.transaction
        }).exec().then(function (removed) {
          Transaction.findByIdAndUpdate(thesplit.transaction, {
            tagged: false
          }).exec().then(function (transaction) {
            console.log('transaction', transaction);
          }).catch(function (err) {
            console.log('error', err);
          });
          console.log('removed', removed);
        });
      });
    });
    Subbudget.remove({
      _id: req.params.subbudgetId
    }).exec().then(function (subbudget) {
      Budget.findByIdAndUpdate(req.params.budgetId, {
        $pull: {
          subbudgets: req.params.subbudgetId
        }
      }, {
        new: true
      }).exec().then(function (budget) {
        res.status(204).send(budget);
      }).catch(function (err) {
        console.log(err);
      });
    }).catch(function (err) {
      console.log(err);
    });
  });
});

//TODO Flag for transation: seen/unseen

/*app.delete('/api/subbudget/:subbudgetId/:budgetId', function (req, res) {
  Subbudget.remove({
    _id: req.params.subbudgetId
  }).exec().then(function (deletedSubbudget) {
    Budget.findByIdAndUpdate(req.params.budgetId, {
      $pull: {
        subbudgets: req.params.subbudgetId
      }
    }, {
      new: true
    }).exec().then(function (budget) {
      res.status(204).send(budget);
    }).catch(function (err) {});
  }).catch(function (err) {
    res.status(500).send(err);
  });
});*/


// BUDGET ENDPOINTS

app.get('/api/budget/:userId', function (req, res) {
  Budget.findOne({
    user: req.params.userId
  }).exec().then(function (budget) {
    console.log('hereeee');
    res.status(200).send(budget);
  }).catch(function (err) {
    console.log('hereeee34343443');
    res.status(500).send(err);
  });
});

app.get('/api/budget/:userId/populate', function (req, res) {
  Budget.findOne({
    user: req.params.userId
  }).deepPopulate(['subbudgets', 'subbudgets.transactions', 'subbudgets.splits', 'subbudgets.splits.transaction']).exec().then(function (budget) {
    console.log('hereeee');
    console.log(budget)
    res.status(200).send(budget);
  }).catch(function (err) {
    console.log('hereeee34343443');
    res.status(500).send(err);
  });
});

//TODO add to users budget array
app.post('/api/budget/:userId', function (req, res) {
  var budget = new Budget(req.body);
  budget.save().then(function (budget) {
    User.findByIdAndUpdate(req.params.userId, {
      $addToSet: {
        budget: budget
      }
    }, {
      new: true
    }).exec().then(function (user) {
      console.log(user);
    }).catch(function (err) {
      console.log(err);
      res.status(500).send(err);
    });
    res.status(201).send(budget);
  }).catch(function (err) {
    res.status(500).send(err);
  });

});

app.delete('/api/budget/:budgetId/:userId', function (req, res) {

  Budget.remove({
    _id: req.params.budgetId
  }).then(function (budget) {
    User.findByIdAndUpdate(req.params.userId, {
      $pull: {
        budget: req.params.budgetId
      }
    }, {
      new: true
    }).exec().then(function (user) {
      console.log(user);
    }).catch(function (err) {
      console.log(err);
      res.status(500).send(err);
    });
    res.status(204).send(budget);
  }).catch(function (err) {
    res.status(500).send(err);
  });

});

app.patch('/api/budget/:budgetId', function (req, res) {
  Budget.findByIdAndUpdate(req.params.budgetId, req.body, {
    new: true
  }).exec().then(function (budget) {
    res.status(201).send(budget);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

// will update subbudget transaction array with id if
// there are no splits, if not...
// split transactions are distributed to
// corresponding buckets
app.post('/api/split/', function (req, res) {
  // {
  //   transaction: {
  //     transId: 'adsfadsfadsfsdaf',
  //     subbudgetId: 'adfasdfsdafsdafasf'
  // },
  //   splits: [
  //     {
  //       amount: '100',
  //       subbudgetId: '234ilg3i2uy498324hkj'
  //     },{
  //       amount: '100',
  //       subbudgetId: '234ilg3i2uy498324hkj'
  //     }
  //   ]
  // }

  console.log(242342342342343, req.body.transaction.subbudgetId);
  console.log(23423423423423423423423423, req.body.transaction.transId);
  if (req.body.splits.length === 1) {
    Subbudget.findByIdAndUpdate(req.body.transaction.subbudgetId, {
      $addToSet: {
        transactions: req.body.transaction.transId //was .transId and threw error
      }
    }, {
      new: true
    }).exec().then(function (bucket) {
      Transaction.findByIdAndUpdate(req.body.transaction.transId, {
        tagged: true
      }).exec().then(function (transaction) {
        res.status(201).send(transaction);
      }).catch(function (err) {
        console.log('ERROR 1A', err);
      });
    }).catch(function (err) {
      console.log('ERROR 1B', err);
      res.status(500).send(err);
    });
  } else {
    Transaction.findByIdAndUpdate(req.body.transaction.transId, {
      tagged: true
    }).exec().then(function (transaction) {
      req.body.splits.forEach(function (split, index, array) {
        let newSplit = new SplitTransaction({
          amount: split.amount,
          transaction: req.body.transaction.transId
        });
        newSplit.save().then(function (newSplit) {
          Subbudget.findByIdAndUpdate(split.subbudgetId, {
            $addToSet: {
              splits: newSplit._id
            }
          }).exec().then(function (bucket) {
            if(index === array.length - 1){
              SplitTransaction.find({transaction: transaction._id}).populate('transaction').exec().then(
                (splits) => {
                  res.json(splits)
                }
              )
            }
          }).catch(function (err) {
            console.log('ERROR 1', err);
            res.status(500).send(err);
          });

        }).catch(function (err) {
          console.log('ERROR 2', err);
          res.status(500).send(err);
        });
      });
    }).catch(function (err) {
      console.log('ERROR 1A', err);
    })
  }
});

// Device Endpoints

app.post('/api/device/', function (req, res) {
  var device = new Device(req.body);
  device.save().then(function (device) {
    res.status(200).send(device);
  }).catch(function (err) {
    res.status(500).send(err);
  })
});

app.post('/api/registerToken', function (req, res) {
  var regtoken = new RegToken(req.body);
  regtoken.save().then(function (token) {
    res.status(200).send(token);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

//user register&login

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.userPassword);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function checkHash(password, userId) {
  var dfd = q.defer()
  User.findById(userId).exec().then(
    (user) => {
      dfd.resolve(bCrypt.compareSync(password, user.userPassword))
    }
  )
  return dfd.promise
}

setTimeout(function () {
  checkHash("a", "5696bd87e4b07f04a7491c6b")
}, 5000)

passport.serializeUser(function (user, done) {
  done(null, user);
});


passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, password, done) {
    console.log(req.body);
    // findOrCreateUser = function(){
    // find a user in Mongo with provided username
    User.findOne({
      'userName': username
    }, (err, user) => {
      // In case of any error return
      if (err) {
        console.log('Error in SignUp: ' + err);
        return done(err);
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return done(null, false)
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();
        // set the user's local credentials
        newUser.userName = username;
        newUser.userPassword = createHash(password);

        // save the user
        newUser.save((err, userdoc) => {
          if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
          }
          let budget = new Budget({
            user: userdoc._id
          })
          budget.save((err, budgetdoc) => {
            console.log("BUDGETDOC", budgetdoc)
            User.findByIdAndUpdate(budgetdoc.user, {
              $set: {
                budget: budgetdoc._id
              }
            }).exec().then(function () {
              return done(null, newUser);
            })
          })
          console.log('User Registration successful');

        });
      }
    });
    // };
    // process.nextTick(findOrCreateUser);
  }
));


passport.use('login', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, password, done) {
    console.log('username', req.body);
    // check in mongo if a user with username exists or not
    User.findOne({
        'userName': username
      },
      function (err, user) {
        // In case of any error, return using the done method
        console.log('USER IN PASSPORT', user)
        if (err) {
          return done(err);
        }
        // Username does not exist, log error & redirect back
        if (!user) {
          console.log('User Not Found with username ' + username);
          return done(null, false);
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)) {
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user);
      }
    );
  }));


// Authentication endpoints

// protect routes with authCtrl.isAuthenticated()
app.post('/login', passport.authenticate('login'), (req, res) => {
  console.log(req.user);
  res.status(200).send(req.user);
});

app.get('/currentuser', function (req, res) {
  res.status(200).send(req.user);
});

app.post('/signup', passport.authenticate('signup'), (req, res) => {
  console.log('do we have a session', req.user);
  res.status(200).send(req.user);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('logged out');
});

/*app.post('/signup', passport.authenticate('signup'), function(req, res) {
  res.status(200).send(req.user);
});*/

var port = process.env.PORT || 3001;
console.log('PORTTTTT', port);
app.listen(port, () => console.log('Listening on ' + port));
