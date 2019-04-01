/*
 * Login Module
 *
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');
var jwt = require('jwt-simple');

var  jwtTokenSecret = "0123456789";

var UserModel = require('../models/user');
var path = require('path')

router.get('/',  (req, res, next) => {
    res.sendFile(path.resolve('public/signin.html'));
});
router.post('/login',  (req, res, next) => {

    try {

        if(!req.body.username && !req.body.password) {
            return res.status(400).json({ "message" : "Please Enter valid fields"});
        }

        UserModel.findOne({username :  req.body.username, password : req.body.password, is_admin_verified : true }).then((result) => {
            if (result) {
                var expires = moment().add(1, 'days').valueOf();
                var token = jwt.encode({
                    email: result.email,
                    exp: expires
                }, jwtTokenSecret);

                return res.json({
                    token: token,
                    message : "User successfully logged in",
                    user : { "name" : result.name, "type" : result.type , "email" : result.email, "username" : result.username}
                });
            } else {
                return res.status(401).json({ "errors": {
                    "message": "Incorrect username or password."}});
            }
        });

    } catch (ex) {
        console.log(ex);
        return res.status(500).json({ "errors": { "message": ex.message}});
    }

});

router.post('/signup', function (req, res, next) {

    try {

        if(!req.body.name && !req.body.email  && !req.body.username && !req.body.password ) {
            return res.status(400).json({ "message" : "Please Enter valid fields"});
        } else {
            req.body["is_admin_verified"] = false;
            var userObj = new UserModel(req.body);
            userObj.save().then( (updatedRecord) => {
                return res.status(200).json({ message: "User saved successfully"});
            }).catch( (error) => {

                return res.status(500).send({ message: "Failed to save the record - "+error.errmsg});
            });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(500).json({  message: ex});
    }
});

module.exports = router;