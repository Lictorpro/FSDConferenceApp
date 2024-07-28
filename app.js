const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

module.exports = app;
