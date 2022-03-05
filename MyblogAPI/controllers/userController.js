const bcrypt = require('bcryptjs');
const users = require('./../models/userModel');
const session = require('../server')

exports.UserRegister = async(req, res) => {
    try{
        

        const {username, email, password } = req.body;

        let user = await users.findOne({email});
        if(user) {
            return res.status(400).json("user already exist")
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        user = new users({
            username,
            email,
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

exports.UserLogin = async(req, res)=>{
    try{

        const {email, password } = req.body;
        const user = await users.findOne(email);
        if(!user){
            res.status(400).json('user does not exist');
        }
        const validate = await bcrypt.compare(password, user.password);
        if(!validate){
            res.status(400).json('wrong password');
        }

        //const {password, ...others} = user._doc;

        res.status(200).json({
            status: "success",
            others
        });

        req.session.isAuth = true;

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
          });
    }
}


