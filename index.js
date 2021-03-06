'use strict'

/*Ami Ekhon Cal*/

const express = require('express')
const multer = require('multer');
const fileType = require('file-type');
const path = require('path');
const fs = require('fs');
const app = express();

const router = express.Router()

const port     = process.env.PORT || 8080;

const Tesseract = require('tesseract.js');


var storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, './images/')
 },

 filename: function (req, file, cb) {
   
     cb(null, Date.now() + path.extname(file.originalname));
   
 }
});



var upload = multer({ storage: storage }).single('image')



router.post('/upload', (req, res) => {

    upload(req, res, function (err) {

        if (err) {

            res.status(400).json({message: err.message})

        } else {

            let path = `/images/${req.file.filename}`
            console.log(path);
            //res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
            let ocr_path=__dirname +path;

            Tesseract.recognize(ocr_path)
                .then(function(result){
                console.log(result.text)
                //Tesseract.terminate(ocr_path)
                
                try {
                    var a = eval(result.text)
                    //console.log(a)
                    
                    } catch (e) {
                if (e instanceof SyntaxError) {
                    //console.log(e.message);
                    var a=e.message;
                     }
                }
                res.status(200).json({ans:a})
                

            });
            

            fs.unlink(ocr_path, (err) => {
            if (err) throw err;
            });

              


        }

    });
});


router.get('/', function(req, res){
    res.json({"message": "Welcome to node ocr give a post request to /upload"});
});

app.use('/', router)

app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 
})


app.listen(port)
console.log(`App Runs on ${port}`)