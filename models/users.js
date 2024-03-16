const mongoose = require('mongoose')
var User = new mongoose.Schema({
    Name: String,
    Age: Number,
    Email: String,
    Password: {
        type: String,
        required: [true, 'Please enter your Pass'],
        select: false

    },
    CurrentPassword: String,
    NewPassword: String,
    ConfirmPassword: {
        type: String,
        validate: {
            validator: function(val) {
                return val == this.password
            },
            message: 'password and confirm Password does not match'
        }

    },
})

module.exports = mongoose.model('userData', User);