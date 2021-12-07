const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, "Book title is required"],
        minlength: 1,
        maxlength: 300
    },
    Author: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Authors',
        required: [true, "Book Author is required"] }],
    Genre: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Genres',
        required: [true, "Book Genre is required"]}],
    Description: {
        type: String
    }



});

module.exports = mongoose.model('Books', bookSchema);