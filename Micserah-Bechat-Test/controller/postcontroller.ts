import { Request, Response } from 'express';
import User, { UserDocument } from '../model/usermodel';
import Post, { PostDocument } from '../model/postmodel';
import dotenv from 'dotenv';
dotenv.config();

export interface Body<T> extends Request {
    body: T
}

const CreatePost = async(user: any, req: Body<{title: string, description: string}>, res: Response) => {
    const title: PostDocument["title"] = req.body.title;
    const description: PostDocument["description"] = req.body.description;
    try {
        if(user){
            const userinfo = await User.findById(user._id)
        
            if(userinfo){
                const post = new Post({
                    title,
                    description,
                    user: userinfo._id
                });
                await post.save();

                userinfo.posts.push(post);
                await userinfo.save();

                res.status(200).json({
                    post: post
                });
            } else{
                res.status(404).json("User not found");
            }
        
    } else{
        res.status(403).json("Please Log in to post")
    }
    } catch (error) {
        res.status(500).json(
            {
                msg: "failed",
                error
            }
        )
    }
};

const getPosts = async(req: Request, res: Response)=>{
    try {
        await Post.find({}).then((posts)=>{
            res.status(200).json(posts);
        });
        
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

const getPost = async(req: Request, res: Response)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post){
            res.status(200).json(post)
        } else{
            res.status(404).json("Post not found")
        }
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}

const updatePost = async(user: any, req: Request, res: Response)=>{
    //const {title} = req.body as PostDocument
    try{
        if(user){
        const post = await Post.findByIdAndUpdate(req.params.id, req.body as PostDocument)
        res.status(200).json({
            status: "Updated successfully",
            post
        })
        } else{
            res.status(403).json("Please login before you update post")
        }
    } catch(err){
        res.status(500).json({
            msg: err
        });
    }
}

const deletePost = async(user:any, req: Request, res: Response) =>{
    try {
        if(user){
        const post = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "Post deleted",
            post
        })
        } else{
            res.status(403).json("please login to delete post")
        }
        } catch (error) {
            res.status(500).json({
                msg: error
            });
    }
}

export { CreatePost, getPost, getPosts, updatePost, deletePost };