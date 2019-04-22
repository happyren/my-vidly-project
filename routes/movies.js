const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie
        .find()
        .sort({ _id: 1 });
    res.send(movies);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Cannot find genre!');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            genre: genre.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    try {
        await movie.save();
        res.send(movie);
    } catch (err) {
        for (field in err) {
            res.send(err.errors[field].message);
        }
    }
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {
            new: true
        });

    if (!movie) return res.status(404).send('No such movie!');

    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('No such movie!');

    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('No such movie!');

    res.send(movie);
});

module.exports = router;