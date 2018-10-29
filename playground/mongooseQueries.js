// Libraries import
const {ObjectID} = require('mongodb');

// Local import
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5bd6c2e3b5eddb029435876b';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}


// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne().then((todo) => {
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('Id not found');
    }
    console.log('Todo By Id', todo);
}).catch((err) => console.log(err));

// Challange
// var id = '5bd5b7afd33e9c0b5499c7b1';

// User.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }

//     console.log('Todo by Id', todo);
// }).catch((err) => console.log(err));