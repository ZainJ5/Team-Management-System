require('dotenv').config
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check_email, insert_user, check_user } = require('../models/user.model')

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isemail_avaiable = await check_email(email);
        if (!isemail_avaiable) {
            res.status(409).send('Email already exists')
        }

        const saltrounds = 10;
        const hashedpass = bcrypt.hash(password, saltrounds)
        await insert_user(name, email, hashedpass)
        res.status(200).send('User successfully registered')
    }
    catch (err) {
        console.log('Error during registration:', err);
        res.status(500).send('Internal server error occured')

    }
}

exports.login = async (req,res) => {
    try{
        const { email, password } = req.body;
        const user =  check_user(email);
        if (!user || (await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user.Id },
            process.env.JWT_SECRET,
            {expiresIn: '5hr'}
        )
        res.json({ token })
    }
    catch(err){
        console.log('Error occured',err)
        res.status(500).send('Internal Server error occured')
    }
}