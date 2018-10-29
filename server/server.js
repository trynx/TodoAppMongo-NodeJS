// Library imports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require ('mongodb');

// Local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

// Parse json request to string
app.use(bodyParser.json());

// Post new todos
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
        
    });
});

// GET all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET todo by id
app.get('/todo/:id', (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }
    
    Todo.findById(id).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => res.status(400).send());

});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app}; // For testing



