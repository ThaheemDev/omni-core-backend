var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

/* POST create user. */
router.post('/accounts', authController.signUp);

/* GET login user. */
router.post('/login', authController.login);

/* GET users listing. */
router.get('/accounts', userController.getUsers);

/* Change users listing. */
router.put('/accounts', authController.updateUser);

/* Change users listing. */
router.delete('/accounts', userController.deleteUser);

module.exports = router;
