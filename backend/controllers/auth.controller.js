require('dotenv').config(); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check_email, insert_user, check_user } = require('../models/user.model');
const pool = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isemail_available = await check_email(email);
        if (!isemail_available) {
            return res.status(409).json({ error: 'Email already exist' });
        }

        const saltrounds = 10;
        const hashedpass = await bcrypt.hash(password, saltrounds);
        const newUserId = await insert_user(name, email, hashedpass);

        const token = jwt.sign(
            { userId: newUserId },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }
        );

        const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [newUserId]);
        const user = result.rows[0];

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.log('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await check_user(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.log('Error occurred', err);
        res.status(500).json({ error: 'Internal Server error' });
    }
};

exports.userinfo = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.userId]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        console.log('Error Occurred', err);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email FROM users ORDER BY name');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};