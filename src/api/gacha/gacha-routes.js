const express = require('express');

const router = express.Router();
const controller = require('./gacha-controller');

router.post('/', controller.gacha);
router.get('/history/:userName', controller.getHistory);
router.get('/prizes', controller.getPrizes);
router.get('/winners', controller.getWinners);
router.post('/seed', controller.seedPrizes);

module.exports = router;
