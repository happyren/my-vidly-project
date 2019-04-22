const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');
const router = express.Router();
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId')

// safe
router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort('genre');
    res.send(genres);
});

// safe
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ genre: req.body.genre });

    try {
        await genre.save();
        res.send(genre);
    } catch (err) {
        for (field in err.errors) {
            res.send(err.errors[field].message);
        }
    }

});

router.get('/:id', validateObjectId, async (req, res) => {
    
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('No such item found');

    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, {
        new: true
    });

    if (!genre) return res.status(404).send('No such item found');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('No such item found');

    res.send(genre);
});

module.exports = router;