var mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

const url = 'mongodb://techupp:upptech1@ds145053.mlab.com:45053/todo-app-test' || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(url, { useNewUrlParser: true });

module.exports = {mongoose};