
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
// const router = express.Router();
var UserModel = require('./models/user');
// To load Configuaration
var config = require('./config/config.js').config;
// MongoDB Setup
mongoose.Promise =  global.Promise;

let   mongourl = 'mongodb://'+ config.db.dbHost + ':' + config.db.dbPort + '/' + config.db.database;

mongoose.connect(mongourl, { useNewUrlParser: true, useCreateIndex: true}).then( (db) => {

    UserModel.findOne({"username" : "admin", "email" : "admin@qlever.com" }).then((result) => {
        if(!result) {
            adminData = {
                "name" : "admin",
                "username" : "admin",
                "password" : "qleveradmin",
                "email" : "admin@qlever.com",
                "is_admin_verified" :  true,
                "type" : "admin"
            }
            var userObj = new UserModel(adminData);
            userObj.save().then( (updatedRecord) => {
                console.log("Admin Setup Creation");
            }).catch( (error) => {
                throw new Error("Admin Init Error");
            });
        }
    }).catch( (error) => {
        console.log(error)
        throw new Error("Admin Init Error");
    });

}).catch( (err) => {
    console.log("\n Mongoose Error : ",err);
});


mongoose.connection.on('connected', function () {
    console.log('Mongoose connection Successful');

});

//If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});



//Middleware
app.use(bodyParser.json({ limit : '256kb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin',null);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Accept-Encoding");

    if(req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }

};

require('./routes')(app);
app.use(function (err, req, res, next) {
    console.error(err);
    if(err.statusCode === 400) {
        res.status(400).json({ errors: true, message: "Bad Request , Please send Proper Request"});
    } else {
        return res.status(500).json({ errors: true, message: "Internal Server Error."});
    }
});

// app.use(router);

app.listen(config.server.port, config.server.host);
console.log('Server Running on http://' +config.server.host + ":" + config.server.port);
