const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event must have a name.'],
    unique: true,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: [true, 'Event must have a date.'],
  },
  numberOfVisitors: {
    type: Number,
    required: [true, 'Event must have number of visitors.'],
  },
  presenters: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Presenter',
    },
  ],
  price: {
    type: Number,
    required: [true, 'Event must have a price.'],
  },
  discountDate: {
    type: Date,
    required: [true, 'Event must have a defined discount date.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
