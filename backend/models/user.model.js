const pool = require('../config/db');

exports.check_email = async (email) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows.length === 0;
    } catch (err) {
        console.log('Error checking email:', err);
        throw err;
    }
}

exports.insert_user = async (name, email, hash_password) => {
    try {
        const res = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, hash_password]
        );
        return res.rows[0].id;
    } catch (err) {
        console.log('Cannot register user:', err);
        throw err;
    }
}

exports.check_user = async (email) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
    } catch (err) {
        console.log('Error occurred:', err);
        throw err;
    }
}