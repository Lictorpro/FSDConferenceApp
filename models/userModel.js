const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must have a first name.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'User must have a last name.'],
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  address1: {
    type: String,
    trim: true,
    required: [true, 'User must have primary address.'],
  },
  address2: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: Number,
    trim: true,
    required: [true, 'User must have a zip code.'],
  },
  city: {
    type: String,
    trim: true,
    required: [true, 'User must have a city.'],
  },
  country: {
    type: String,
    trim: true,
    required: [true, 'User must have a country.'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'User must have an email.'],
    unique: true,
  },
  emailConfirm: {
    type: String,
    required: [true, 'Please confirm your email.'],
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Emails are not the same!',
    },
  },
  accessToken: {
    type: String,
    trim: true,
    unique: true,
  },
  promoCode: {
    type: mongoose.Schema.ObjectId,
    ref: 'PromoCode',
    unique: true,
  },
  events: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
    },
  ],
  usedPromoCode: {
    type: mongoose.Schema.ObjectId,
    ref: 'PromoCode',
    unique: true,
  },
  debt: {
    type: Number,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
