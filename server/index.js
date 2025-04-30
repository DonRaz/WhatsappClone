const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const prisma = require('./configs/db');
const usersRouter = require('./routers/usersRouter');
const messagesRouter = require('./routers/messagesRouter');
const conversationsRouter = require('./routers/conversationsRouter');
const authRouter = require('./routers/authRouter');
// const { userSchema, messageSchema, conversationSchema } = require('@fullstack-final-project/shared');

const app = express();

// Middleware
app.use(cors());

// Serve static files from the client directory
// http://localhost:3010/readme.html
app.use(express.static('../client'));

// NOTE - might be obsolete with Socket.io
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/conversations', conversationsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 
