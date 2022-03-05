const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
     fullname: {
        type: String,
       
     },
     username: {
        type: String,
        unique: true,
        
     },
     email: {
        type: String,
        unique: true,
        required: true
     },
     password: {
         type: String,
         required: true, 
        
        }

},
{timestamps: true});

module.exports = mongoose.model('User', userSchema);