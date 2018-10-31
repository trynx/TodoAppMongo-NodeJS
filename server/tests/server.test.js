// Libraries import
let expect = require('expect');
let request = require('supertest');
let {ObjectID} = require('mongodb');

// Local  imports
let {app} = require('./../server');
let {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 11111
}];


beforeEach((done => {
    // Clean todo DB
    Todo.deleteMany().then(() => {
        return Todo.insertMany(todos);
            }).then(() => done()); 
}));

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            })
    });

    it('Should not create todo with invalid body data', (done) => {
        var text = '    ';
         request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });
});


describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todo/id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        var diffId = new ObjectID();

        request(app)
            .get(`/todo/${diffId.toHexString}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-objects id', (done) => {
        request(app)
            .get('/todo/123')
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todo/:id', () => {
    it('Shoud remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todo/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).not.toBeTruthy();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should return 404 if todo no found', (done) => {
        request(app)
            .delete(`/todo/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todo/123asd')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todo/:id', () => {
    it('Should update the todo', (done) => {
        // grab id of the first item
        var hexId = todos[0]._id.toHexString();
        var text = 'Enjoy the journey';

        // update text, set completed true
        request(app)
            .patch(`/todo/${hexId}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                // Custom expect - check internal value
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeTruthy();
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        // Grab id of second todo item
        var hexId = todos[1]._id.toHexString();
        var text = 'That was the last time they heard from him...';

        // Update text, set completed to false
        request(app)
            .patch(`/todo/${hexId}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});