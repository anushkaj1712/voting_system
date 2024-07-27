const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    partyName: {
        type: String,
        enum: ['BJP', 'AAP', 'JSP', 'CONGRESS'],
        required: true,
        unique: true
    },
    voteCount: {
        type: Number,
        default: 0
    },
    
    
});

const Party = mongoose.model('Party', partySchema);
module.exports = Party;
