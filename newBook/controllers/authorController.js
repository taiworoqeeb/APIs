const authors = require('../models/authorModel');

//This is for creating new Author's information
exports.CreateAuthor = async(req, res) => {
    try{
        await authors.create(req.body);

        res.status(200).json("Author Successfully Created");

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
}; 

//This is for geting all Authors' information
exports.GetAllAuthors = async(req, res) => {
    try{
        const Allauthors = await authors.find();
        res.status(200).json(Allauthors);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for geting an Author's information
exports.GetAuthor = async(req, res) => {
    try{
        const author = await authors.findById(req.params.id);
        res.status(200).json(author);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for updating Author's information
exports.UpdateAuthor = async (req, res)=>{
    try{
        await authors.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json("Author Information Updated");
       

    } catch(err){
        res.status(404).json({
            message: err
        });

    }
};

//This is for deleting Author's information
exports.DeleteAuthor = async (req, res)=>{
    try{
        await authors.findByIdAndRemove(req.params.id)
       res.status(200).json("Author Deleted Successfully");
    } catch(err){
        res.status(404).json({
            message: err
        });
    }
};
