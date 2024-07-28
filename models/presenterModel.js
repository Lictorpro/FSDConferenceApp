const mongoose = require('mongoose');

const presenterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Presenter must have a first name.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Presenter must have a last name.'],
    trim: true,
  },
  presentationTime: {
    type: String,
    required: [true, 'Presenter must have a defined presentation time.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Presenter = mongoose.model('Presenter', presenterSchema);

module.exports = Presenter;
