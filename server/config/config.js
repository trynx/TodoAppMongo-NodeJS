var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://techupp:upptech1@ds247223.mlab.com:47223/todo-app-dev'; 
} else if (env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://techupp:upptech1@ds145053.mlab.com:45053/todo-app-test';
}