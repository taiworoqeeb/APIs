const Post = require("../models/postModel");
const fs = require("fs");
module.exports = class API {
    static async getAllPost(req, res) {
        try{
            const posts = await Post.find();
            res.status(200).json(posts);

        } catch(err){
            console.log(err)
            res.status(404).json({
            status: "fail",
            message: err
        });
        };
    };

    static async getPost(req, res){
        try{
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch(err){
        console.log(err)
        res.status(404).json({
            status: "fail",
            message: err
        });
        }
    };

    static async createPost(req, res){
        const post = req.body;
        const imagename = req.file.filename;
        post.image = imagename;
        
        try{
           
            await Post.create(post);
            res.status(201).json({
            message: 'Post Created Successfully!'
        });

        } catch(err){
             console.log(err)
             res.status(400).json({
                 status: "fail",
                 message: err
        });
        }
    };

    static async updatePost(req, res){
        let new_image = "";
        if(req.file){
            new_image = req.file.filename;
            try {
                fs.unlinkSync("./uploads/" + req.body.old_image);
            } catch (error) {
                console.log(err)
            }
        } else{
            new_image = req.body.old_image;
        }
        const newPost = req.body;
        newPost.image = new_image;
        try{
            await Post.findByIdAndUpdate(req.params.id, newPost);
    
            res.status(201).json({
                message: 'Post Updated Successfully'
            });

        } catch(err){
            console.log(err)
             res.status(404).json({
                 status: "fail",
                 message: err
        });
        }
    
    };

    static async deletePost(req, res){
        try {
            const post = await Post.findByIdAndDelete(req.params.id);
            if(post.image != ''){
                try{
                    fs.unlinkSync("./uploads/" + post.image);
                } catch(err){
                    console.log(err)
            }
        }  
            res.status(201).json({
                    message: 'Post Deleted Successfully'
                });
        
            
        } catch(err){
            console.log(err)
             res.status(404).json({
                 status: "fail",
                 message: err
            });
        };
    };
};