const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,  
    },
    age: {
        type: Number,    
        
    }, 
    email: {
        type: String,
    },
    phoneNumber: {
        type: Number, 
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
    },
    isvoted:{
        type: Boolean,
        default:false,
    }
});
const user = mongoose.model('user', userSchema);
module.exports = user;