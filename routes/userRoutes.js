const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/register').post(userController.register);

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

router.route('/cancel/:userId').post(userController.cancelRegistration);

router
  .route('/changeRegistration/:userId')
  .put(userController.changeRegistration);

module.exports = router;
