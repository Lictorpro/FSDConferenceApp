const PromoCode = require('../models/promoCodeModel');
const factory = require('./handlerFactory');

exports.getAllPromoCodes = factory.getAll(PromoCode);
exports.getPromoCode = factory.getOne(PromoCode);
exports.createPromoCode = factory.createOne(PromoCode);
exports.updatePromoCode = factory.updateOne(PromoCode);
exports.deletePromoCode = factory.deleteOne(PromoCode);
