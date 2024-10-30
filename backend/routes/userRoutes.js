const express = require('express');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController'); 

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
