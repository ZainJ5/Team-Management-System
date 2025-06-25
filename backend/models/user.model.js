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

exports.insert_user = async (name,email,hash_password) => {
    try{
        pool.query('Insert into users (name,email,password) values ($1,$2,$3)',[name,email,hash_password])
    }catch(err){
        console.log('Cannot register user')
        throw err
    }
}

exports.check_user = async (email) => {
    try{
        const res = await pool.query('Seleect * From users Where email = $1 ',[email])
        return res.rows;
    }
    catch(err){
      console.log('Error occured',err)
    }
}