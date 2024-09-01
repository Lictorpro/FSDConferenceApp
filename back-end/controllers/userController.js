const User = require('../models/userModel');
const PromoCode = require('../models/promoCodeModel');
const Registration = require('../models/registrationModel');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const eventController = require('./eventController');

generateAccessToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const accessToken = crypto.createHash('sha256').update(token).digest('hex');

  return accessToken;
};

generatePromoCode = function () {
  const promoCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  return promoCode;
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.register = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const events = [...req.body.events];
    let registrations = [];
    for (const event of events) {
      const eventData = await Event.findById(event).session(session);
      if ((await eventController.getNumberOfFreeSeats(event)) < 1) {
        await session.abortTransaction();
        session.endSession();
        return next(
          new AppError(
            `There are no free seats left for ${eventData.name} event!`,
            500
          )
        );
      }
      const registration = await Registration.create([{ event: event }], {
        session,
      });
      registrations.push(registration[0]._id);
    }

    //Logika za koriscenje promo koda
    if (req.body.usedPromoCode) {
      usedPromoCode = await PromoCode.findOne({
        code: req.body.usedPromoCode,
      }).session(session);
      if (!usedPromoCode) {
        await session.abortTransaction();
        session.endSession();
        return next(
          new AppError(
            `Promo code: ${req.body.usedPromoCode} does not exist!`,
            500
          )
        );
      } else {
        usedPromoCode.isUsed = true;
        await usedPromoCode.save({ session });
      }
    }
    //kraj

    const accessToken = generateAccessToken();
    const promoCode = generatePromoCode();
    const message = `Your access token for future actions on the app: ${accessToken}.\n Additionaly you can give your friend this promo code: ${promoCode} for 5% of for his registration!`;

    const [newPromoCode] = await PromoCode.create([{ code: promoCode }], {
      session,
    });
    let usedPromoCode = null;

    const [newUser] = await User.create(
      [
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          company: req.body.company,
          address1: req.body.address1,
          address2: req.body.address2,
          zipCode: req.body.zipCode,
          city: req.body.city,
          country: req.body.country,
          email: req.body.email,
          emailConfirm: req.body.emailConfirm,
          accessToken: accessToken,
          promoCode: newPromoCode._id,
          registrations: registrations,
          usedPromoCode: usedPromoCode?._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    try {
      await sendEmail({
        email: req.body.email,
        subject: 'Your access token',
        message,
      });
    } catch (err) {
      return next(
        new AppError(
          'There was an error sending email. Please try again later!',
          500
        )
      );
    }

    res.status(201).json({
      status: 'success',
      data: { data: newUser },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

exports.cancelRegistration = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user.active) {
    return next(new AppError('This user does not exist anymore!', 404));
  }

  const promoCode = await PromoCode.findById(user.promoCode);

  const registrations = user.registrations;

  for (const registration of registrations) {
    await Registration.deleteOne({ _id: registration._id });
  }

  user.active = false;
  user.registrations = [];
  promoCode.isUsed = true;
  user.save();
  promoCode.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.changeRegistration = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = await User.findById(req.params.userId)
    .populate({
      path: 'registrations',
      model: 'Registration',
    })
    .session(session);

  if (!user.active) {
    return next(new AppError('This user does not exist anymore!', 404));
  }

  try {
    const events = [...req.body.events];
    let registrations = user.registrations.map((r) => r._id.toString());
    let userEvents = [];

    for (const registration of user.registrations) {
      userEvents.push({
        registrationId: registration._id,
        eventId: registration.event._id,
      });
    }

    for (const event of events) {
      if (
        !userEvents.some(
          (userEvent) => userEvent.eventId.toString() === event.toString()
        )
      ) {
        console.log(await eventController.getNumberOfFreeSeats(event));
        if ((await eventController.getNumberOfFreeSeats(event)) < 1) {
          const eventData = await Event.findById(event).session(session);
          await session.abortTransaction();
          session.endSession();
          return next(
            new AppError(
              `There are no free seats left for ${eventData.name} event!`,
              500
            )
          );
        }

        const registration = await Registration.create([{ event: event }], {
          session,
        });
        registrations.push(registration[0]._id.toString());
      }
    }

    for (const userEvent of userEvents) {
      console.log(events);
      if (!events.includes(userEvent.eventId.toString())) {
        await Registration.deleteOne(
          { _id: userEvent.registrationId },
          { session }
        );

        registrations = registrations.filter(
          (regId) => regId !== userEvent.registrationId.toString()
        );
      }
    }

    user.registrations = registrations;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

exports.authenticateUser = catchAsync(async (req, res, next) => {
  const { email, accessToken } = req.body;

  if (!email || !accessToken) {
    return next(new AppError('Please provide an email and access token!', 400));
  }

  const user = await User.findOne({ email }).select('+accessToken');

  if (!user) {
    next(new AppError('Incorrect email!', 401));
  }

  if (user.accessToken !== accessToken) {
    next(new AppError('Incorrect access token!', 401));
  }

  if (!user.active) {
    return next(new AppError('This user does not exist anymore!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.getUserDebt = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);
  const registrationIds = user.registrations;

  const registrations = await Registration.find({
    _id: { $in: registrationIds },
  }).populate({
    path: 'event',
    model: 'Event',
  });

  //Logika za popust
  let totalDebt = 0;
  let eventDebt = 0;
  let events = [];
  let twoDayDiscount = null;
  let promoCodeDiscount = null;
  for (const registration of registrations) {
    if (registration.createdAt < registration.event.discountDate) {
      eventDebt = {
        event: registration.event.name,
        originalPrice: registration.event.price,
        debt: registration.event.price * 0.9,
        discount: '10%',
        discountAmount:
          registration.event.price - registration.event.price * 0.9,
      };
      totalDebt += registration.event.price * 0.9;
    } else {
      eventDebt = {
        event: registration.event.name,
        originalPrice: registration.event.price,
        debt: registration.event.price,
        discount: null,
        discountAmount: 0,
      };
      totalDebt += registration.event.price;
    }

    events.push(eventDebt);
  }

  console.log(events);

  if (registrations.length > 1) {
    twoDayDiscount = {
      discount: '10%',
      discountAmount: totalDebt - totalDebt * 0.9,
    };
    totalDebt = totalDebt * 0.9;
  }

  if (user.usedPromoCode) {
    promoCodeDiscount = {
      discount: '5%',
      discountAmount: totalDebt - totalDebt * 0.95,
    };
    totalDebt = totalDebt * 0.95;
  }

  res.status(200).json({
    status: 'success',
    data: {
      events: events,
      twoDayDiscount: twoDayDiscount,
      promoCodeDiscount: promoCodeDiscount,
      totalDebt: totalDebt,
    },
  });
});
