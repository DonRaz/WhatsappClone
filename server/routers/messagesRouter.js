const express = require('express');
const router = express.Router();
const { messageSchema } = require('@fullstack-final-project/shared');

// Mock data store
let messages = [];

// GET all messages
router.get('/', (req, res) => {
  res.json(messages);
});

// GET message by id
router.get('/:id', (req, res) => {
  const message = messages.find(m => m.id === req.params.id);
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json(message);
});

// GET messages by conversation id
router.get('/conversation/:conversationId', (req, res) => {
  const conversationMessages = messages.filter(m => m.conversationId === req.params.conversationId);
  res.json(conversationMessages);
});

// POST create new message
router.post('/', (req, res) => {
  try {
    // Validate request body against schema
    const validatedMessage = messageSchema.parse(req.body);
    messages.push(validatedMessage);
    res.status(201).json(validatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// PUT update message
router.put('/:id', (req, res) => {
  try {
    const validatedMessage = messageSchema.parse(req.body);
    const index = messages.findIndex(m => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Message not found' });
    messages[index] = validatedMessage;
    res.json(validatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// DELETE message
router.delete('/:id', (req, res) => {
  const index = messages.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Message not found' });
  messages.splice(index, 1);
  res.status(204).send();
});

module.exports = router; 