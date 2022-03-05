const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ISBN: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 13
    },
    genre: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        require: true
    },
    yearPublished: {
        type: Number,
        required: true,
        minlength: 4,
        maxlength: 4
    },
    sold: {
        type: Number,
        required: true
    }

});

module.exports =  mongoose.model('bookinfo', bookSchema);