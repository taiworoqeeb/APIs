const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    RatingValue: {
        type: Number,
        required: [true, "Rating value is required"]
    },
    Title: {
        type: String,
        required: [true, "Review Title is required"]
    },
    Content: {
        type: String
    },
    Date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Review', reviewSchema);