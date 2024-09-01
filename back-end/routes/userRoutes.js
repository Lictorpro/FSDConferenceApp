const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/register').post(userController.register);
router.route('/authenticate').post(userController.authenticateUser);

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

router.route('/cancel/:userId').post(userController.cancelRegistration);

router
  .route('/changeRegistration/:userId')
  .put(userController.changeRegistration);

router.route('/debt/:userId').get(userController.getUserDebt);

module.exports = router;
