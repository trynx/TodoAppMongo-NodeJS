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

    // Delete many
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // Delete one
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // Find one & delete - save the one that is deleted - recommended
    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
    });
    // client.close();
});