const bcrypt = require('bcryptjs');
const users = require('./../models/userModel');

exports.UserRegister = async(req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const savedPost = await new user({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const resultPost = await savedPost.save();


        res.status(200).json({
            status: "success",
            resultPost
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
        const user = await users.findOne({username: req.body.username});
        !user && res.status(400).json('wrong user');

        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json('wrong password');

        const {password, ...others} = user._doc;

        res.status(200).json({
            status: "success",
            others
        });

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
          });
    }
}


