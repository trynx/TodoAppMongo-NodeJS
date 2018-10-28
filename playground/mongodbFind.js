// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


const url = 'mongodb://localhost:27017/TodoApp';
const dbName = 'TodoApp';

const client = new MongoClient(url, {useNewUrlParser: true});

client.connect((err) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db(dbName);

    // db.collection('Todos').find({
    //     _id: new ObjectID('5bd57fe6bb9634e73384d2d1')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // });

    // db.collection('Todos').countDocuments().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // });

    db.collection('Users').find({name: 'Nick'}).count().then((count) => {
        console.log(`User count: ${count}`);
    }).catch((err) => {
        console.log('Unable to fetch users', err);
    });

    // client.close();
});