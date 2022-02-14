require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const fileRoutes = require('./routes/file');
const downloadPage =  require('./routes/show')
const download = require('./routes/download');
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(express.static('public'));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use(express.json({limit: '109mb'}));
app.use(express.urlencoded({limit: "109mb", extended: true, parameterLimit:5000}));
app.use(bodyParser.json({limit: '109mb'}));
const PORT = process.env.PORT || 5000;

const connectDb = require('./config/db');


connectDb();
//template engin
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


//Routes
app.use('/',fileRoutes);
app.use('/files', downloadPage)
app.use('/files/download', download);
app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
})