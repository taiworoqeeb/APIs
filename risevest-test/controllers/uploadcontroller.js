const File = require('../model/Filemodel');
const User = require('../model/Usermodel');
const AWS = require('aws-sdk');
require('dotenv').config();
const fs = require('fs');
var s3 = new AWS.S3({
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
  });
var bucketName = process.env.AWS_BUCKET;

const uploadToS3Bucket = (image, filePath) => {
    return new Promise((resolve, reject) => {
      let bucketPath = filePath;
      let params = {
        Bucket: bucketName,
        Key: bucketPath,
        Body: image,
      };
      s3.putObject(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          resolve();
        }
      });
    });
  };

exports.Download = async (req, res) => {
    const userinfo = req.params.username;
    const { folder, filename} = req.body;
    try {
        const user = await User.findOne({ where: {
            username: userinfo
        }})
        if(user){
            if(folder){
                const filePath = `${user.username}/${folder}/${filename}`
                let params = {
                    Bucket: bucketName,
                    Key: filePath,
                  };
             
                let filestream = s3.getObject(params).createReadStream();
                filestream.pipe(res);
               
            } else{
                const filePath = `${user.username}/${filename}`
                let params = {
                    Bucket: bucketName,
                    Key: filePath,
                  };

                let filestream = s3.getObject(params).createReadStream();
                filestream.pipe(res);
            }

        } else{
            res.status(404).json('user not found')
        }
    } catch (error) {
        res.status(500).json(error);
    }

}
      


exports.Uploads = async (req, res) => {
        var { folder } = req.body;
    try {
       const user =  await User.findOne({ 
            where: {
                username: `${req.params.username}`
            }
        })
       const fileinfo = await File.findOne({
            where: {
                userid: `${user.id}`
            }
        })
        
            if(fileinfo){
                if(folder){
                    var filepath = `${user.username}/${folder}/${req.files.file.name}`
                    if(req.files.file.size > 200000000) {
                        res.status(400).json("file size exceeds 200mb")
                    } else{
                    await uploadToS3Bucket(req.files.file.data, filepath);
                    var location = `https://risevest-test.s3.amazonaws.com/${user.username}/${folder}/${req.files.file.name}`
                    filedata = new File({
                        filename: req.files.file.name,
                        fileurl: location,
                        file_dir: filepath,
                    })

                    await filedata.save();
                    res.status(200).json(filedata);
                    }
                } else{
                    var filepath = `${user.username}/${req.files.file.name}`
                    if(req.files.file.size > 200000000) {
                        res.status(400).json("file size exceeds 200mb")
                    } else{
                    await uploadToS3Bucket(req.files.file.data, filepath)
                    var location = `https://risevest-test.s3.amazonaws.com/${user.username}/${req.files.file.name}`
                    filedata = new File({
                        filename: req.files.name,
                        fileurl: location,
                        file_dir: filepath,
                    })

                    await filedata.save();
                    res.status(200).json(filedata);
                }
            }
            } else{
                if(folder){
                    var filepath = `${user.username}/${folder}/${req.files.file.name}`
                    if(req.files.file.size > 200000000) {
                        res.status(400).json("file size exceeds 200mb")
                    } else{
                    await uploadToS3Bucket(req.files.file.data, filepath)
                    var location = `https://risevest-test.s3.amazonaws.com/${user.username}/${folder}/${req.files.file.name}`
                    filedata = new File({
                        userid: user.id,
                        filename: req.files.file.name,
                        fileurl: location,
                        file_dir: filepath,
                    })

                    await filedata.save();
                    res.status(200).json(filedata);
                }
                } else{
                    var filepath = `${user.username}/${req.files.file.name}`
                    if(req.files.file.size > 200000000) {
                        res.status(400).json("file size exceeds 200mb")
                    } else{
                   await uploadToS3Bucket(req.files.file.data, filepath)
                   var location = `https://risevest-test.s3.amazonaws.com/${user.username}/${req.files.file.name}`
                        filedata = new File({
                            userid: user.id,
                            filename: req.files.file.name,
                            fileurl: location,
                            file_dir: filepath,
                        })

                    await filedata.save();
                    res.status(200).json(filedata);
                    }
                }
            }
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error
        })
    };
};

exports.Listfiles = async (req, res) => {
    try {
        var params = {
            Bucket: bucketName
        }
        s3.listObjects(params, (err, data) => {
            var fileinfo = data.Contents
            var datalength = data.Contents.length
            for (var i=0; i < datalength; i++){
            if (err){
                console.log(err)
            } else {
                res.status(200).json({
                    status: "Success",
                    data: fileinfo[i].Key
                })
            }
            }
        })
    } catch (error) {
        res.status(500).json(error)
    }
};

exports.FileAttribute = async (req, res) => {
    const { file_dir, attribute} = req.body;
    const params = {
        Bucket: bucketName,
        Key: file_dir
    }
    try {
        await File.findOne({ where: {
            file_dir: file_dir
        }}).then(async (file) => {
            if(attribute === "unsafe"){
                await file.destroy(file.id);
                s3.deleteObject(params, (err, data) => {
                    if(err){
                        console.log(err)
                    } else{
                     res.status(200).json("File unsafe and file deleted")
                    }
                })
             } else {
                 res.status(200).json("File is safe")
             };
        })
        
        
    } catch (error) {
        res.status(500).json(error)
    }
};





