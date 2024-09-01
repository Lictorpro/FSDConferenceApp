const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getNumberOfFreeSeats = async (eventId) => {
  const event = await Event.findById(eventId);
  console.log(event);
  const numberOfVisitors = event.numberOfVisitors;

  const numberOfRegistrations = await Registration.find({
    event: eventId,
  }).countDocuments();

  const numberOfFreeSeats = numberOfVisitors - numberOfRegistrations;

  return numberOfFreeSeats;
};

//exports.getAllEvents = factory.getAll(Event);
exports.getEvent = factory.getOne(Event);
exports.createEvent = factory.createOne(Event);
exports.updateEvent = factory.updateOne(Event);
exports.deleteEvent = factory.deleteOne(Event);

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const docs = await Event.find().select('-__v');
  const updatedDocs = await Promise.all(
    docs.map(async (doc) => {
      const availableSeats = await this.getNumberOfFreeSeats(doc._id);
      return { ...doc.toObject(), availableSeats };
    })
  );
  res.status(200).json({
    status: 'success',
    results: updatedDocs.length,
    data: { data: updatedDocs },
  });
});
