const express = require('express');
const presenterController = require('../controllers/presenterController');

const router = express.Router();

router
  .route('/')
  .get(presenterController.getAllPresenters)
  .post(presenterController.createPresenter);

router
  .route('/:id')
  .get(presenterController.getPresenter)
  .patch(presenterController.updatePresenter)
  .delete(presenterController.deletePresenter);

module.exports = router;
