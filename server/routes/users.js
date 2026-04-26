const express = require('express');
const { getUser, subscribe, unsubscribe } = require('../controllers/users');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/find/:id', getUser);
router.put('/subscribe/:id', verifyToken, subscribe);
router.put('/unsubscribe/:id', verifyToken, unsubscribe);

module.exports = router;
