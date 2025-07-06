import express from 'express';
import messageController from '../controllers/message.controller.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// Lấy toàn bộ tin nhắn giữa 2 người
router.get('/:id', authorize, messageController.getMessages);

// Gửi tin nhắn đến 1 người
router.post('/send/:id', authorize, messageController.sendMessage);

// Lấy tin nhắn mới nhất với 1 người
router.get('/latest/:id', authorize, messageController.getLatestMessage);

export default router;
