const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

// safe
function validateGenre(genre) {
    const scheme = {
        genre: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre, scheme);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;