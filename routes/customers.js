const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');
const router = express.Router();

// why a customers list could be obtained???
router.get('/', async (req, res) => {
    const customers = await Customer
        .find()
        .sort({ _id: 1 });
    res.send(customers);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    try {
        await customer.save();
        res.send(customer);
    } catch (err) {
        for (field in err) {
            res.send(err.errors[field].message);
        }
    }

});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
        new: true
    });

    if (!customer) return res.status(404).send('No such customer!');

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(404).send('No such customer!');

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('No such customer!');
    res.send(customer);
});

module.exports = router;