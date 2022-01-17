const bcrypt = require('bcryptjs');
const User = require('../model/Usermodel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const passport = require('passport');

exports.RegisterUser = async (role, req, res) => {
    try{

        const {fullname, username, email, password } = req.body;

        let user = await User.findOne({email}) && await User.findOne({username});
        if(user) {
            return res.status(400).json("user already exist")
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        user = new User({
            fullname,
            username,
            email,
            role,
            password: hashedPass
        });
    
        await user.save();

 
        res.status(200).json({
            status: "success",
            user
        });

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.LoginUser = async (role, req, res) => {
    try{

        const {email, password } = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json('user does not exist');
        }

        if(user.role !== role){
            return res.status(403).json({
                message: "Please ensure you are logging-in from the right portal",
                success: false
            });
        }
        const validate = await bcrypt.compare(password, user.password);
        if(validate){
            let token = jwt.sign(
                { 
                fullname: user.fullname,
                email: user.email, 
                username: user.username, 
                role: user.role, 
                user_id: user._id}, 
                process.env.TOKEN, { expiresIn: "7 days"});

            let result = {
                fullname: user.fullname,
                username: user.username,
                role: user.role,
                token: `Bearer ${token}`,
                expiresIn: 168
            };

            res.status(200).json({
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
        res.status(404).json({
            status: 'fail',
            message: err
          });
    }
};


exports.userAuth = passport.authenticate('jwt', {session: true});



exports.profile = user => {
   return {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
       };

};

exports.getUsers = async (req, res)=>{
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne(req.params.username);
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

exports.updateUser = async(req, res) => {
    try{
        const user = await User.findOneAndUpdate(req.params.email, req.body);
        res.send(user);
        res.status(200).json("updated successfully")
    } catch(error){
        res.status(404).json({
            message: "Not Found",
            error
        })
    }
}

exports.deleteUser = async(req, res) => {
    try{
        const user = await User.findOneAndDelete(req.params.email);
        res.send(user);
        res.status(200).json("updated successfully")
    } catch(error){
        res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

exports.checkRole = roles => (req, res, next) => 
!roles.includes(req.user.role) 
    ? res.status(401).json("Unauthorized") 
    : next();

