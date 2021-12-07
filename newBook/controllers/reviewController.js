const reviews = require('../models/reviewModel');

//This is for creating new review's information
exports.Createreview = async(req, res) => {
    try{
        await reviews.create(req.body);

        res.status(200).json("review Successfully Created");

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for geting all reviews' information
exports.GetAllreviews = async(req, res) => {
    try{
        const Allreviews = await reviews.find();
        res.status(200).json(Allreviews);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for geting an review's information
exports.Getreview = async(req, res) => {
    try{
        const review = await reviews.findById(req.params.id);
        res.status(200).json(review);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for updating review's information
exports.Updatereview = async (req, res)=>{
    try{
        await reviews.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json("review Information Updated");
       

    } catch(err){
        res.status(404).json({
            message: err
        });

    }
};

//This is for deleting review's information
exports.Deletereview = async (req, res)=>{
    try{
        await reviews.findByIdAndRemove(req.params.id)
       res.status(200).json("review Deleted Successfully");
    } catch(err){
        res.status(404).json({
            message: err
        });
    }
};
