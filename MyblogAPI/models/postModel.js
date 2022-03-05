const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, 
{timestamps: true}

);

module.exports = mongoose.model('postAuth', postSchema);