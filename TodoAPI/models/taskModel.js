const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    task:{
        type: String,
        required: true
    },
    scheduleDate: {
        type: Date,
        require: true
    }
});

module.exports = new mongoose.model('task', taskSchema);