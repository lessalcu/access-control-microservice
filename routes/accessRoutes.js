const express = require('express');
const AccessController = require('../controllers/accessController');

const router = express.Router();

router.post('/register-access', AccessController.registerAccess);

module.exports = router;