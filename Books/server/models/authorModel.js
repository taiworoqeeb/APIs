const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "author's firstname required"]
    },
    lastname: {
        type: String,
        required: [true, "author lastname required"]
    },
    biography: {
        type: String,
        required: [true, "author's biblography required"]
    },
    publisher: {
        type: String,
        required: [true, "publisher required"]
    }
});

module.exports =  mongoose.model('authorinfo', authorSchema);