require('./config/config')

// Library imports
let _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require ('mongodb');
var bcrypt = require('bcryptjs');

// Local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();
let port = process.env.PORT;

// Parse json request to string
app.use(bodyParser.json());

// Post new todos
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
        
    });
});

// GET all todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET todo by id
app.get('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }
    
    Todo.findOne({
        _id: id,
        _creator: req.user._id
        }).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => res.status(400).send());

});

// DELETE todo by id
app.delete('/todo/:id', authenticate, (req, res) => {
    // Get id
    var id = req.params.id;

    // Validate the id -> not? return 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Remove todo by id
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
        }).then((todo) => {
        // If no doc, send 404
        if(!todo){
            res.status(404).send();
        }
        
        // If doc, send doc back with 200
        res.status(200).send({todo});
    }).catch((err) => res.status(400).send()); 
            
});

// PATCH /todo/:id
app.patch('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
        }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo}); 
    }).catch((err) => {
        res.status(400).send();
    })
      


});

// POST /users 
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => res.status(400).send(err));
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
    // from request get user email & password
    var body = _.pick(req.body, ['email', 'password']);

    // get from mongoDB the user
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/users/signout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log('Started on port', port);
});

module.exports = {app}; // For testing



