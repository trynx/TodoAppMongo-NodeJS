// Libraries import
let expect = require('expect');
let request = require('supertest');
let {ObjectID} = require('mongodb');

// Local  imports
let {app} = require('../server');
let {Todo} = require('../models/todo');
let {User} = require('../models/user');
let {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    })
});

describe('GET /todo/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should not return todo doc created by other user', (done) => {
        request(app)
            .get(`/todo/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        var diffId = new ObjectID();

        request(app)
            .get(`/todo/${diffId.toHexString}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-objects id', (done) => {
        request(app)
            .get('/todo/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todo/:id', () => {
    it('Shoud remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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

    it('Shoud not remove a todo that the user did not created', (done) => {
        var hexId = todos[0]._id.toHexString();
        
        request(app)
            .delete(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should return 404 if todo no found', (done) => {
        request(app)
            .delete(`/todo/${(new ObjectID).toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todo/123asd')
            .set('x-auth', users[1].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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

    it('Should not update the todo if not the creator', (done) => {
        // grab id of the first item
        var hexId = todos[0]._id.toHexString();
        var text = 'Enjoy the journey';

        // update text, set completed true
        request(app)
            .patch(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                text,
                completed: true
            })
            .expect(404)
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        // Grab id of second todo item
        var hexId = todos[1]._id.toHexString();
        var text = 'That was the last time they heard from him...';

        // Update text, set completed to false
        request(app)
            .patch(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Should return 401 if not athenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        var email = 'maybe@itworks.nop';
        var password = 'UwUowo';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeDefined();
                expect(res.body._id).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeDefined();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => done(err));
            }); 
    });

    it('Should return validation errors if requrest invalid', (done) => {
        var email = 'something.not';
        var password = 'UwU';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('Should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = '123123';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done); 
    });

});

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeDefined();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((err) => done);
            });
    });

    it('Should reject invalid login', (done) => {
        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post('/users/login')
            .send({
                email, 
                password: password + '!'})
            .expect(400)
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('DELETE /users/signout', () => {
    it('Should remove auth token on logout', (done) => {
         // DELETE /users/signout
         request(app)
            .delete('/users/signout')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });
});