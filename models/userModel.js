const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Promo code must have a defined code.'],
    trim: true,
  },
  used: {
    type: Boolean,
    default: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
