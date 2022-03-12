import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import UserModel, { UserDocument } from '../model/usermodel';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';

export interface Body<T> extends Request {
    body: T
};


const RegisterUser = async (req: Body<{fullname: string, username: string, email: string, password: string, interests: [string]}>, res: Response) => {
    try{

        let user = await UserModel.findOne({ email: req.body.email });
        if(user){
            res.status(403).json("user already exist")
        } else{
            const salt = await bcrypt.genSalt(12);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            user = new UserModel({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                interests: req.body.interests,
                password: hashedPass
            });
        
            await user.save();
            res.status(201).json({
                status: "success",
                user
            });
        }
        

    } catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: err
        });
    }
};

const LoginUser = async (req:  Body<{username: string, password: string}>, res: Response) => {
    try{
        let user = await UserModel.findOne({username: req.body.username});
        if(!user){
            return res.status(404).json({
                message: 'user does not exist',
                success: false
            });
        }

        const validate = await bcrypt.compare(req.body.password, user.password);
        if(validate){
            let token = jwt.sign(
                { 
                fullname: user.fullname,
                email: user.email, 
                username: user.username,  
                user_id: user._id }, 
                process.env.TOKEN as string, { expiresIn: "24h"});

            let result = {
                fullname: user.fullname,
                username: user.username,
                token: `Bearer ${token}`,
                expiresIn: 24
            };

            return res.status(200).json({
                ... result,
                status: "successfully logged in",
                success: true
            });

        } else{
           return res.status(403).json({
                message: 'wrong password',
                success: false
            });
        }


    } catch(err){
        console.error(err)
        return res.status(500).json({
            status: 'fail',
            message: err
          });
    }
};


const userAuth = passport.authenticate('jwt', {session: true});



const profile = (user: any) => {
   return {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        interests: user.interests,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
       };

};

const getUsers = async (req: Request, res: Response)=>{
    try {
        const users = await UserModel.find().populate('posts')
       return res.status(200).json(users)
    } catch (error) {
        return res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({username: req.params.username}).populate('posts')
       return res.status(200).json({
           user
    })

    } catch (error) {
       return res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

const updateUser = async(user: any, req: Request, res: Response) => {
    try{
        if(user){
            await UserModel.findOneAndUpdate({email: user.email}, req.body as UserDocument);
            return res.status(201).json({
                 message: "updated successfully"
             })
        } else{
            res.status(401).json("Please log in")
        }
       
    } catch(error){
       return res.status(400).json({
            message: "Not Found",
            error
        })
    }
}

const deleteUser = async(user: any, req: Request, res: Response) => {
    try{
        if(user){
            await UserModel.findOneAndDelete({email: user.email});
            return res.status(200).json({
                message: "deleted successfully",
                
            })
        } else{
            res.status(401).json("Please log in to delete your account")
        }
        
    } catch(error){
       return res.status(400).json({
            message: "Not Found",
            error
        })
    }
};

export { RegisterUser, userAuth, LoginUser, profile, getUser, getUsers, updateUser, deleteUser };
