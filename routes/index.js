
var express = require('express');
var router = express.Router();

var userController = require('./userController');
var authController = require('./authController');
var authMiddleware = require('./authMiddleware');

module.exports = function(app){

    app.use('/', authController);
    app.use('/user', authMiddleware, userController);

};
