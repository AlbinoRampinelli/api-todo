const mongoose = require('mongoose');


const  User = mongoose.model('User', {
    email: {
        type: String,
        require: true,
        trim: true,
        minlenggth: 5
    }
});

module.exports = {
    User
}