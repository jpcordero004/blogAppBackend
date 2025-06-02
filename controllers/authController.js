// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};
