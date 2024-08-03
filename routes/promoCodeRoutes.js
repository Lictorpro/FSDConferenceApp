const express = require('express');
const promoCodeController = require('../controllers/promoCodeController');

const router = express.Router();

router
  .route('/')
  .get(promoCodeController.getAllPromoCodes)
  .post(promoCodeController.createPromoCode);

router
  .route('/:id')
  .get(promoCodeController.getPromoCode)
  .patch(promoCodeController.updatePromoCode)
  .delete(promoCodeController.deletePromoCode);

module.exports = router;
