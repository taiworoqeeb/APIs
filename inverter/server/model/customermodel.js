const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    meter_number: {
        type: Number,
        unique: true,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    customer_name: {
        type: String
    },
    meter_status: {
        type: String,
        enum: ['paid', 'unpaid'],
        required: true

    },
    Activation_status:{
        type: String,
        enum: ['activate', 'deactivate'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

} );

module.exports = new mongoose.model('Customers', CustomerSchema);