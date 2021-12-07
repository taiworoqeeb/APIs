const mongoose = require('mongoose');
const genreSchema = new mongoose.Schema({
    GenreName: {
        type: String,
        required: [true, "Book Genre is required"],
        minlength: 1,
        maxlength: 100
    },
    publishedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }]
});

module.exports = mongoose.model("Genres", genreSchema);