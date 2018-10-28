// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


const url = 'mongodb://localhost:27017/TodoApp';
const dbName = 'TodoApp';

const client = new MongoClient(url);

client.connect((err) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db(dbName);

    // db.collection('Todos').insertOne({
    //     text: 'Something TODO',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unalbe to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Nick',
    //     age: 25,
    //     location: 'Israel'
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert user', err);
    //     }

    //     console.log(result.ops[0]._id.getTimestamp());
    // })

    // client.close();
});