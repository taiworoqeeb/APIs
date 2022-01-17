const mongoose = require('mongoose');
const ComplainSchema = mongoose.Schema({
    ticketId: {
        type: Number,
        default: 0
    },
    ticket_status:{
        type: String,
        enum: ['unsolved', 'attending', 'solved'],
        default: 'unsolved',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

});

module.exports = new mongoose.model('complain', ComplainSchema);