const fs = require("fs");
const _ = require('lodash');

exports.SingleUpload = async(req, res) => {
    const {destination} = req.body
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else{
            let file = req.files.file;

            if(destination){
                var dir = `./uploads/${destination}`
                if(!fs.existsSync(dir)){
                    res.send('folder doesn\'t exist, creating folder and uploading file now' )
                    fs.mkdirSync(dir);
                }
                file.mv(dir + '/' + file.name);
                res.send({
                    status: true,
                    message: 'File Uploaded',
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size,
                        destination: dir + '/' + file.name
                    }
                })
            } else{
                file.mv('./uploads/' + file.name)
                res.send({
                    status: true,
                    message: 'File Uploaded',
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size,
                        destination: './uploads/' + file.name
                    }
                })
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.MultipleUpload = async(req, res)=>{
    const {destination} = req.body
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else{
            let data = []

            _.forEach(_.keysIn(req.files.files), (key) => {
                let file = req.files.files[key];
                if(destination){
                    var dir = `./uploads/${destination}`
                    if(!fs.existsSync(dir)){
                        res.send('folder doesn\'t exist, creating folder and uploading file now' )
                        fs.mkdirSync(dir);
                    }
                    file.mv(dir + '/' + file.name);
                    data.push ({
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size,
                        destination: dir + '/' + file.name
                    });

                } else{
                    file.mv('./uploads/' + file.name)
                    data.push ({
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size,
                        destination: './uploads/' + file.name
                    });
                }
            });
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
            
        }
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.DownloadFile = async(req, res) => {
    const {destination, filename} = req.body
    try {
        if(destination){
            var dir = `./uploads/${destination}/${filename}`;
            if(!fs.existsSync(dir)){
                res.status(404).json({
                    staus: false,
                    message: "File doesn't exist"
                });
            } else{
                res.download(__dirname + dir, (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            }
        } else{
            var dir = `./uploads/${filename}`;
            if(!fs.existsSync(dir)){
                res.status(404).json({
                    staus: false,
                    message: "File doesn't exist"
                });
            } else{
                res.download(__dirname + dir, (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.CreateFolder = async(res, req) => {
    
}