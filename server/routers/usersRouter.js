// Router's role - activate the right function based on the request's data and the route
const express = require('express');
const usersService = require('../services/usersService');

const router = express.Router();
const { userSchema } = require('@fullstack-final-project/shared');

// Entry point: http://localhost:3010/users

// Mock data store
let users = [];

// GET all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET user by id
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST create new user
router.post('/', (req, res) => {
  try {
    // Validate request body against schema
    const validatedUser = userSchema.parse(req.body);
    users.push(validatedUser);
    res.status(201).json(validatedUser);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// PUT update user
router.put('/:id', (req, res) => {
  try {
    const validatedUser = userSchema.parse(req.body);
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index] = validatedUser;
    res.json(validatedUser);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// DELETE user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

// Update maximum number of actions
// entry point: http://localhost:3010/users/:id/maxActions?maxActions=100
router.put('/:id/maxActions', async (req, res) => {
  const { id } = req.params;
  const { maxActions } = req.query;
  const updatedUser = await actionsUtils.updateMaxNumberOfActions(id, +maxActions);
  res.json(updatedUser);
});

module.exports = router;
