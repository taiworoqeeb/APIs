const genres = require('../models/genreModel');

//This is for creating new genre's information
exports.Creategenre = async(req, res) => {
    try{
        await genres.create(req.body);

        res.status(200).json("genre Successfully Created");

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for geting all genres' information
exports.GetAllgenres = async(req, res) => {
    try{
        const Allgenres = await genres.find();
        res.status(200).json(Allgenres);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for geting an genre's information
exports.Getgenre = async(req, res) => {
    try{
        const genre = await genres.findById(req.params.id);
        res.status(200).json(genre);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for updating genre's information
exports.Updategenre = async (req, res)=>{
    try{
        await genres.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json("genre Information Updated");
       

    } catch(err){
        res.status(404).json({
            message: err
        });

    }
};

//This is for deleting genre's information
exports.Deletegenre = async (req, res)=>{
    try{
        await genres.findByIdAndRemove(req.params.id)
       res.status(200).json("genre Deleted Successfully");
    } catch(err){
        res.status(404).json({
            message: err
        });
    }
};