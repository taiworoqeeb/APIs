const mongoose = require('mongoose');

let ticket = 1;
let ticketcount = {
    type: Number,
    default: () => ticket++
};

const ComplainSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    ticketId: ticketcount,
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
    },
    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]

},
{timestamps: true}
);

module.exports = new mongoose.model('complain', ComplainSchema);