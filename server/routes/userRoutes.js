const express = require('express');
const router = express.Router();
const { getUsersInRoom, addUserToRoom, removeUserFromRoom } = require('../controllers/userController');

router.get('/:roomId/users', getUsersInRoom);
router.post('/:roomId/users', addUserToRoom);
router.delete('/:roomId/users/:userId', removeUserFromRoom);

module.exports = router;