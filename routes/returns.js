const auth = require('../middleware/auth');
const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const validate = require('../middleware/validate');
const Joi = require('joi');


router.post('/', [auth, validate(validateReturns)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send('No such rental exists!');
    if (rental.dateReturned) return res.status(400).send('The Rental is processed!');

    try {
        rental.return();
        await rental.save();
        await Movie.update({ _id: rental.movie._id }, {
            $inc: {
                numberInStock: 1
            }
        });
    } catch (ex) {
        for (field in ex)
            res.status(500).send('Something Wrong!');
    }

    return res.send(rental);
});

function validateReturns(req) {
    const scheme = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(req, scheme);
}

module.exports = router;