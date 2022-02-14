const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../model/file');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../services/emailServices');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage } ); //100mb

router.post('/',upload.single('myfile'), async (req, res) => {
  
    
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        
        await file.save().then((response) => {
        res.status(200).json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
       } )

});


//sending mail of link

router.post("/send", async(req,res)=>{
    const {uuid,emailTo,emailFrom} = req.body;

    //validate req
    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({error: 'All fields are required'})
    }
    //det data from database

    const file = await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error: 'Email Already sent.'})
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();


    //send 

    sendMail({
         from: emailFrom,
         to:emailTo,
         subject: 'inShare file sharing',
         text:`${emailFrom} shared a file with you`,
         html: require('../services/gmailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000) + ' KB',
            expires:'24 hours'
         }),
    });
    return res.send({success:true})

})

module.exports = router;