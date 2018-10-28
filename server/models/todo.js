var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null 
    }
});


// Examples 
// var newTodo = new Todo({
//     completed: false,
//     text: 'Play Maple Story 2'
// });
// newTodo.save().then((res) => {
//     console.log('Add todo', res);
// }, (err) => {
//     console.log('Unable to save todo');
// });

module.exports = {Todo};