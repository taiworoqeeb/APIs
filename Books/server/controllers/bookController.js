const books = require('../models/bookModel');

//This is for creating a new book information
exports.CreateBook = async(req, res) => {
    try{
        await books.create(req.body);

        res.status(200).json("Book Successfully Created");

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for getting all books information
exports.GetAllBooks = async(req, res) => {
    try{
        const Allbooks = await books.find();
        res.status(200).json(Allbooks);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for getting a book information
exports.GetBook = async(req, res) => {
    try{
        const book = await books.findById(req.params.id);
        res.status(200).json(book);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};

//This is for updating a book information
exports.UpdateBook = async (req, res)=>{
    try{
        await books.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json("Book Information Updated");
       

    } catch(err){
        res.status(404).json({
            message: err
        });

    }
};

//This is for deleting a book information
exports.DeleteBook = async (req, res)=>{
    try{
        await books.findByIdAndRemove(req.params.id)
       res.status(200).json("Book Deleted Successfully");
    } catch(err){
        res.status(404).json({
            message: err
        });
    }
};
