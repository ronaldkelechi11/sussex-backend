const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Early return pattern for better performance
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Successful login
        console.log("Admin has logged in");
        return res.status(200).json({
            success: true,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;