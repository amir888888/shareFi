require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
// const fileRoutes = require('./routes/file');
// const downloadPage =  require('./routes/show')
const download = require('./routes/download');
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
// app.set('port', (process.env.PORT || 5000));

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use(express.json({limit: '109mb'}));
app.use(express.urlencoded({limit: "109mb", extended: false, parameterLimit:5000}));
app.use(bodyParser.json({limit: '109mb'}));

const connectDb = require('./config/db');


connectDb();
//template engin
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
    res.send('this is heroku server')
})

//Routes
app.use('api/files',require('./routes/file'));
app.use('files', require('./routes/show'))
app.use('files/download', require('./routes/download'));
app.listen(app.get('port'), () =>{
   // console.log(`Listening on port ${PORT}`);
})