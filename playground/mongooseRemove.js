// Libraries import
const {ObjectID} = require('mongodb');

// Local import
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

var id = '5bd6f7acc6be1b108cb2536f';

Todo.findByIdAndRemove(id).then((todo) => {
    console.log(todo);
});