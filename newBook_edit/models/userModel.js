const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "admin"]
    },
    accessToken: {
        type: String
    }

}, 
{timestamps: true}

);

module.exports = mongoose.model('Users', userSchema);