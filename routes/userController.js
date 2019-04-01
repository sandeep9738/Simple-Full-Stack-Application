var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {

    try {

        UserModel.find({ type : "Standard"}).then( (results) => {
            return res.status(200).send({ data: results});
        }).catch( (error) => {
            console.error(error);
            return res.status(500).send({ message: error});
        });
    } catch (ex) {
        console.log(ex);
        return res.status(500).send({ message: ex});
    }
});



router.patch('/:id', function (req, res, next) {
    try {

        if (!req.params || !req.params.id) {
            return res.status(403).json({ message: "Invalid user Id"});
        } else if(!req.body.name && !req.body.email  && !req.body.username) {
            return res.status(400).json({ "message" : "Please Enter valid fields"});
        } else {
            UserModel.findById(req.params.id).then( (userDetails) => {
                userDetails.set(req.body);
                userDetails.save().then( (updatedRecord) => {
                    return res.status(200).json({ message: "user updated successfully"});
                });
            }).catch( (error) => {
                return res.status(403).send({ message: "Failed to update the record"});
            });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(500).send({ message: ex});
    }
});




router.get('/:id', function (req, res, next) {

    try {

        if (!req.params || !req.params.id ) {
            return res.status(500).json({  message: "Invalid user Id"});
        }
            UserModel.findById(req.params.id).then( (userDetails) => {
                return res.status(200).json({ data: userDetails});
            }).catch( (error) => {
                console.error(" \n Error:", error);
                return res.status(500).json({  message: error});
            });

    } catch (ex) {
        console.log(ex);
        return res.status(500).json({  message: ex});
    }
});


router.delete('/:id', function (req, res, next) {

    try {
        if (!req.params || !req.params.id) {
            return res.status(500).json({  message: "Invalid user Id"});
        }
            UserModel.deleteOne({ "_id" : mongoose.Types.ObjectId(req.params.id)}).then( (userDetails) => {
                return res.status(200).json({  "message" : "User Deleted successfully"});
            }).catch( (error) => {
                return res.status(500).json({  message: error});
            });

    } catch (ex) {
        console.log(ex);
        return res.status(500).json({  message : ex});
    }
});


router.post('/changePassword', (req, res, next) => {
    try {

        if(!req.body.email && !req.body.oldPassword && !req.body.newPassword) {
            return res.status(400).json({ "message" : "Please Enter valid fields"});
        }

        UserModel.findOne({"email" : req.body.email, "password" : req.body.oldPassword }).then((result) => {
            if (result) {

                UserModel.update( { "email" : req.body.email }, { "password" : req.body.newPassword}).then((result) => {
                    return res.status(200).json({"message": "New password successfuly updated."});
                }).catch( (err) => {

                    return res.status(500).json({ "message":  err });
                });
            }
            else{
                return res.status(401).json({ "message": "Incorrect oldPassword. Please provide valid password." });
            }
        });
    } catch (ex) {
        console.log(ex);
        return res.status(500).json({ "errors": {   "message": ex.message}});
    }
});


router.patch('/adminVerificationToUser/:id', (req, res, next) => {
    try {

        if (!req.params || !req.params.id) {
            return res.status(500).json({  message: "Invalid user Id"});
        }

            UserModel.update({ "_id" : mongoose.Types.ObjectId(req.params.id) }, { "is_admin_verified" : true}).then((result) => {
                return res.status(200).json({"message": "New password successfuly updated."});
            }).catch( (err) => {
                return res.status(500).json({ "message":  err });
            });

    } catch (ex) {
        console.log(ex);
        return res.status(500).json({ "errors": {   "message": ex.message}});
    }
});

module.exports = router;