const express = require('express');
const router = express.Router();
const { conversationSchema } = require('@fullstack-final-project/shared');

// Mock data store
let conversations = [];

// GET all conversations
router.get('/', (req, res) => {
  res.json(conversations);
});

// GET conversation by id
router.get('/:id', (req, res) => {
  const conversation = conversations.find(c => c.id === req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation);
});

// GET conversations by user id
router.get('/user/:userId', (req, res) => {
  const userConversations = conversations.filter(c => 
    c.usersIds.some(user => user.id === req.params.userId)
  );
  res.json(userConversations);
});

// POST create new conversation
router.post('/', (req, res) => {
  try {
    // Validate request body against schema
    const validatedConversation = conversationSchema.parse(req.body);
    conversations.push(validatedConversation);
    res.status(201).json(validatedConversation);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// PUT update conversation
router.put('/:id', (req, res) => {
  try {
    const validatedConversation = conversationSchema.parse(req.body);
    const index = conversations.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Conversation not found' });
    conversations[index] = validatedConversation;
    res.json(validatedConversation);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// DELETE conversation
router.delete('/:id', (req, res) => {
  const index = conversations.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Conversation not found' });
  conversations.splice(index, 1);
  res.status(204).send();
});

// PUT update conversation typing status
router.put('/:id/typing', (req, res) => {
  try {
    const { userId, isTyping } = req.body;
    const conversation = conversations.find(c => c.id === req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    if (isTyping) {
      if (!conversation.currentlyTyping.some(user => user.id === userId)) {
        const user = conversation.usersIds.find(u => u.id === userId);
        if (user) conversation.currentlyTyping.push(user);
      }
    } else {
      conversation.currentlyTyping = conversation.currentlyTyping.filter(user => user.id !== userId);
    }

    res.json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

module.exports = router; 