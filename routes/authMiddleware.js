var jwt = require('jwt-simple');
var moment = require('moment');
 var  jwtTokenSecret = "0123456789";
 var UserModel = require('../models/user');

module.exports = function(req, res, next) {

    console.log(" - Middlwware - ");

    var token = (req.body && req.body.authorization) || (req.query && req.query.authorization) || req.headers['authorization'];
    var bearerToken;
    var app = req.app;
    console.log("\n token: ", token);

    try {

        if (token) {

            var decoded = jwt.decode(token, jwtTokenSecret);
            if (decoded.exp <= Date.now()) {
                return res.status(403).json({ "errors": {   "message":  'Access token has expired. Please Renew it.'} });
            }
            console.log("\n Decoded : ", decoded);

            UserModel.findOne({"email" : decoded.email }).then((result) => {
                        console.log("\n User Successfully Authenticated ");
                        next();
                }).catch( (err) => {
                    console.log(err);
                    return res.status(500).json({ "errors": {   "message":  err}});
                });

        } else {
            throw new Error(" Invalid access token ");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ "errors": {   "message":  JSON.stringify(err)  } } );
    }
};