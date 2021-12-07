const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: [true, "Author Firstname is required"],
        minlength: 1,
        maxlength: 200
    },
    LastName: {
        type: String,
        minlength: 1,
        maxlength: 200
    },
    publishedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }]




});

module.exports = mongoose.model('Authors', authorSchema);