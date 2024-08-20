const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

registrationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'event',
    select: '-__v',
  });
  next();
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
