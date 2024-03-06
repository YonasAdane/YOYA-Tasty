const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipe: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    createdAt: { 
        type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);