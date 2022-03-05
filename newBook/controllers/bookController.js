const books = require('../models/bookModel');
const authors = require('../models/authorModel');
const genres = require('../models/genreModel');

//This is for creating a new book information
exports.CreateBook = async(req, res) => {
    try{

        const book = await new books(req.body);
        await book.save();

        const author = await authors.findById({_id: book.Author})
        author.publishedBooks.push(book);
        await author.save();

        const genre = await genres.findById({_id: book.Genre})
        genre.publishedBooks.push(book);
        await genre.save();

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
        const Allbooks = await books.find().populate(['Author', 'Genre']);
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
        const book = await books.findById(req.params.id).populate(['Author', 'Genre']);
        res.status(200).json(book);

    }catch(err){
        res.status(404).json({
            message: err
        });
    };
};
//search for books by title
exports.searchBook = async(req, res) => {
    try{
        const book = await books.findOne({Title: req.body.Title}).populate('Author', 'Genre');
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
