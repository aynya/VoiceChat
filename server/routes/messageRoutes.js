const express = require('express');
const router = express.Router();
const { getMessagesInRoom, sendMessage } = require('../controllers/messageController');

router.get('/:roomId/messages', getMessagesInRoom);
router.post('/:roomId/messages', sendMessage);

module.exports = router;