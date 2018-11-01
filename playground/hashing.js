let {SHA256} = require('crypto-js');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);  
    })
});


// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'asdasd');
// console.log(token);

// var decoded = jwt.verify(token, 'asdasd');
// console.log(decoded);
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'Something something').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'Something something').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed, there is a hacker~!!!')
// }
  


