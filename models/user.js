
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    username : {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin_verified : {
        type: Boolean,
        required: true,
        default : false
    },
    type : {
        type: String,
        required: true,
        default : "Standard"
    }

}, { collection: "user"});

module.exports = mongoose.model('user', UserSchema);

