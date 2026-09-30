import { Router } from 'express';
import { processMessage } from '../services/aiService.js';

const router = Router();

router.post('/message', (req, res) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  const response = processMessage(message, context);
  res.json(response);
});

export default router;
