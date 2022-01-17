const mongoose = require('mongoose');
const StaffSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
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
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    role: {
        type: String,
        enum: ['staff', 'admin'],
        default: 'staff'
    }
    },
{timestamps: true}
);

module.exports = new mongoose.model("Staff", StaffSchema);
