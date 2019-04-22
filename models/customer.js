const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 25
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    }
}));

function validateCustomer(customer) {
    const scheme = {
        name: Joi.string().min(5).max(25).required(),
        phone: Joi.string().min(10).max(10).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, scheme);
}

exports.Customer = Customer;
exports.validate = validateCustomer;