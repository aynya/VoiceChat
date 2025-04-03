const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom } = require('../controllers/roomController');

router.get('/', getRooms);
router.get('/:roomId', getRoomById);
router.post('/', createRoom);

module.exports = router;