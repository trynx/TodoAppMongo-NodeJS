let {ObjectID} = require('mongodb'); 
let jwt = require('jsonwebtoken');

let {Todo} = require('./../../models/todo');
let {User} = require('./../../models/user');

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

let users = [{
    _id: userOneId,
    email: 'nick@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'koichy@gmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 11111,
    _creator: userTwoId
}];

let populateTodos = (done) => {
    // Clean todo DB
    Todo.deleteMany().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done()); 
};

let populateUsers = (done) => {
    User.deleteMany().then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo] );
    }).then(() => done());
};


module.exports = {todos, populateTodos, users, populateUsers}; 