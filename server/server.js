require('./config/config')

// Library imports
let _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require ('mongodb');

// Local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
let port = process.env.PORT;

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

// DELETE todo by id
app.delete('/todo/:id', (req, res) => {
    // Get id
    var id = req.params.id;

    // Validate the id -> not? return 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        // If no doc, send 404
        if(!todo){
            res.status(404).send();
        }
        
        // If doc, send doc back with 200
        res.status(200).send({todo});
    }).catch((err) => res.status(400).send()); 
            
});

app.patch('/todo/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo}); 
    }).catch((err) => {
        res.status(400).send();
    })
      


});

app.listen(port, () => {
    console.log('Started on port', port);
});




module.exports = {app}; // For testing



