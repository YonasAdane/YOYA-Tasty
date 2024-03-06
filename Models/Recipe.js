const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    ingredients: [
        {
        name: { type: String },
        quantity: { type: String || Number }
    }],
    steps: [
        { type: String }
    ],
    category: { type: String },
    tags: [
        { type: String }
    ],
    foodPicture: { 
        type: String
     },
    ingredientsPhotoLink: { 
        type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);