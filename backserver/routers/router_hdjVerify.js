const express = require('express');
const router = express.Router();
const {hdjVerify} = require('../controllers/controller_hdjVerify.js');

router.post('/verify',hdjVerify);

module.exports = router;