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
    text: 'Second test todo'
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

})
