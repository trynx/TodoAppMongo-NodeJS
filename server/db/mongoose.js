var mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
mongodb://<dbuser>:<dbpassword>@ds145053.mlab.com:45053/todo-app-test
var url = process.env.MONGODB_URI /*|| 'mongodb://techupp:upptech1@ds145923.mlab.com:45923/todo-app-production'*/;
mongoose.connect(url, { useNewUrlParser: true });

module.exports = {mongoose};