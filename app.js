const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const presenterRouter = require('./routes/presenterRoutes');
const promoCodeRouter = require('./routes/promoCodeRoutes');
const eventRouter = require('./routes/eventRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  widnowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour!`,
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

app.use('/api/v1/presenters', presenterRouter);
app.use('/api/v1/promoCodes', promoCodeRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
