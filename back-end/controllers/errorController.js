const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.keyPattern)[0];
  //const value = err.errorResponse.keyPattern[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log(err);
  const errors = err.errors
    ? Object.values(err.errors).map((el) => el.message)
    : [];
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.errorMessage,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = { ...err };
  if (err.name === 'CastError') {
    error = handleCastErrorDB(error);
  } else if (err.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  } else if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }

  sendError(error, res);
};
