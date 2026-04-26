const express = require('express');
const { addComment, deleteComment, getComments } = require('../controllers/comments');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', verifyToken, addComment);
router.delete('/:id', verifyToken, deleteComment);
router.get('/:videoId', getComments);

module.exports = router;
