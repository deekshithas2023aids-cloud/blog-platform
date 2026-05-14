const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();



// ================= REGISTER =================

router.post('/register', async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: 'User Registered Successfully'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
});



// ================= LOGIN =================

router.post('/login', async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: 'User Not Found'
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {

            return res.status(400).json({
                message: 'Invalid Password'
            });
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            'secretkey',
            {
                expiresIn: '1d'
            }
        );

        res.json({
            token: token,
            username: user.username
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;