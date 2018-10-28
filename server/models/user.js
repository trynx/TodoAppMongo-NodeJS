var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    }
});

// Examples
// var newUser = new User({
//     email: 'n@e.j'
// });

// newUser.save().then((doc) => {
//     console.log('Add new user', doc);
// }, (err) => {
//     console.log('Unable to add new user', err);
// });

module.exports = {User};