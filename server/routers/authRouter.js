const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');

// Entry point http://localhost:3010/auth

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log('login: ---- ', email, password);
		if (!email || !password) {
			return res.status(400).json({ message: 'Username and password are required' });
		}
		
		const user = await usersService.getUserByEmailNPassword(email, password);
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		
		// const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
		const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '30 days' });

		res.json({ token, userFullName: user.fullName });
	} catch (error) {
		console.error('Authentication error:', error);
		if (error.message.includes('Invalid email or password')) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		return res.status(500).json({ message: 'An error occurred during authentication', error: error.message });
	}
/** front end code to save the token and userFullName
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userFullName', user.name); 
    location.href = 'products.html'; // redirect page
*/
});

// register
router.post('/register', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersService.createUser(email, password);
	res.json(user);
});

//log out
router.post('/logout', (req, res) => {
	// Nothing to do server-side with the JWT itself
	res.json({ message: 'Logged out successfully' });
/** Front-end logout code
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userFullName');
    location.href = 'login.html'; // redirect to login page
*/
});

module.exports = router;
