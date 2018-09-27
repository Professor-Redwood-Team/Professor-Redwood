'use strict';

const express = require('express');
const Switch = require('../controllers/switches');

const router = express.Router();

router.post('/off', Switch.Off);
router.post('/on', Switch.On);
router.post('/restart', Switch.Restart);

module.exports = router;
