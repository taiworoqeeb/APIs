
const post = require('../models/postModel');


exports.CreatePost = async(req, res)=>{
    try{
        const savePost = await new post(req.body);
        const savedPost = await savePost.save();
        res.status(200).json({
            status: 'success',
            savedPost
        });

    } catch(err){
        res.status(500).json({
            message: err
        });
    }
};

exports.UpdatePost = async (req, res)=>{
    try{
        const post = await post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json({
                status: 'updated successfully'
            });
        } else {
            res.status(403).json({
                status: 'You can only update your post'
            });
        }

    } catch(err){
        res.status(500).json({
            message: err
        });

    }
};

exports.DeletePost = async (req, res)=>{
    try{
        const post = await post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json({
                status: 'deleted successfully'
            });
        } else{
            res.status(403).json({
                status: 'You can only delete your post'
            });
        }
    } catch(err){
        res.status(500).json({
            message: err
        });
    }
};

exports.getAllPosts = async (req, res)=>{
    try{
        const posts = await post.find();
        res.status(200).json({
            status: 'success',
            posts
        });
    } catch(err){
        res.status(500).json({
            message: err
        });
    }
};

exports.getPost = async (req, res)=>{
    try{
        const post = await post.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            post
        });
    } catch (err){
        res.status(500).json({
            message: err
        });
    }
}