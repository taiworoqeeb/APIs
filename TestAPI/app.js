const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
dotenv.config({ path: "./config.env"});
const imgModel = require('./model');

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('DB connection successful'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get('/', (req, res) => {
    imgModel.find({}, (err, items) =>{
        if(err){
            console.log(err);
            res.status(500).send('An error Occurred', err);
        } else{
            res.render('imagesPage', { items: items });
        }
    });
});

app.post('/', upload.single('image'), (req, res, next) => {
  
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        file: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'any'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            item.save();
            res.redirect('/');
        }
    });
});



const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if(err) console.log("Error in Server setup");
    console.log(`listening to port ${port}`)
});