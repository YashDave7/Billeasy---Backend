const mongoose = require('mongoose');
const User = require('./User');
const { Schema } = mongoose;

const ReviewsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    }
},
    {
        timestamps: true
    });

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    reviews: [ReviewsSchema]
});

module.exports = mongoose.model('book', BookSchema);