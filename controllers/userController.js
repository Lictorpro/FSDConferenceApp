const User = require('../models/userModel');
const PromoCode = require('../models/promoCodeModel');
const Registration = require('../models/registrationModel');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');

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
    const accessToken = generateAccessToken();
    const promoCode = generatePromoCode();
    const message = `Your access token for future actions on the app: ${accessToken}.\n Additionaly you can give your friend this promo code: ${promoCode} for 5% of for his registration!`;

    const [newPromoCode] = await PromoCode.create([{ code: promoCode }], {
      session,
    });
    let usedPromoCode = null;

    const events = [...req.body.events];
    let registrations = [];
    for (const event of events) {
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

  if (!user) {
    return next(new AppError('No user found with passed id!', 404));
  }

  const promoCode = await PromoCode.findById(user.promoCode);
  user.active = false;
  promoCode.isUsed = true;
  user.save();
  promoCode.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
