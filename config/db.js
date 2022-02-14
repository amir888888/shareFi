require('dotenv').config();
const mongoose = require('mongoose');

function connectDb(){
    //db connnection 
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch(err => {
        console.log(err);
    });
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('database connection is open');
    })
}


module.exports = connectDb;