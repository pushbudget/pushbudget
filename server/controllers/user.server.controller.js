'use strict';
let User = require("../models/user.model.js")

module.exports = exports = {};

exports.findUser = (req, res)=>{
    User.find({})
}

exports.findUser = (req, res)=>{
    User.findById(req.params.id).exec().then(
      (req, res) => {
        res.json()
      }
    )
}

exports.addUser = (req, res)=>{
  var user = new User({
    userName: req.body.userName,
    userPassword: req.body.userPassword,
    access_token: req.body.access_token
  })
  User.save(user)
}

exports.populateUser = (req, res)=>{
  User.findById(req.params.id)
    .deepPopulate(['budget', 'budget.subBudgets', 'accounts', 'accounts.institution', 'budget.subbudgets.transactions', 'budget.subbudgets.splits', 'budget.subbudgets.splits.transaction'])
    .exec()
    .then((doc)=>{
      res.json(doc)
    }).catch((err)=>{
      console.log(err)
    })
}
