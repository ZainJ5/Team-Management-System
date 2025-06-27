const express  = require('express')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId])
        const user = result.rows[0]

        if (!user) return res.status(404).send('User not found')

        req.user = user
        next()
    } catch (err) {
        res.status(401).send('Error Occured',err)
    }
}

module.exports = authMiddleware;