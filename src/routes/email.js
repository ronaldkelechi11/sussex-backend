const express = require('express');
const axios = require('axios');
const router = express.Router();
const ReceivedEmail = require('../models/receivedEmail');

const RESEND_API_BASE = process.env.RESEND_API_URL || 'https://api.resend.com';

// GET /emails/sent - List sent emails via Resend API provider
router.get('/sent', async (req, res) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            return res.status(500).json({ error: 'RESEND_API_KEY is not configured.' });
        }

        const response = await axios.get(`${RESEND_API_BASE}/emails`, {
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching sent emails from Resend:', error.response?.data || error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'Failed to fetch sent emails from Resend API';
        res.status(status).json({ error: message });
    }
});

// GET /emails/sent/:id - Fetch single sent email details via Resend API provider
router.get('/sent/:id', async (req, res) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            return res.status(500).json({ error: 'RESEND_API_KEY is not configured.' });
        }

        const emailId = req.params.id;
        const response = await axios.get(`${RESEND_API_BASE}/emails/${emailId}`, {
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching sent email ${req.params.id} from Resend:`, error.response?.data || error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'Failed to fetch sent email details from Resend API';
        res.status(status).json({ error: message });
    }
});

// GET /emails/received - List received emails stored in database
router.get('/received', async (req, res) => {
    try {
        const receivedEmails = await ReceivedEmail.find().sort({ receivedAt: -1 }).exec();
        res.status(200).json(receivedEmails);
    } catch (error) {
        console.error('Error fetching received emails:', error);
        res.status(500).json({ error: 'Failed to fetch received emails' });
    }
});

// GET /emails/received/:id - Get a specific received email by ID or emailId
router.get('/received/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let receivedEmail;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            receivedEmail = await ReceivedEmail.findById(id);
        }
        if (!receivedEmail) {
            receivedEmail = await ReceivedEmail.findOne({ emailId: id });
        }

        if (!receivedEmail) {
            return res.status(404).json({ error: 'Received email not found' });
        }

        res.status(200).json(receivedEmail);
    } catch (error) {
        console.error(`Error fetching received email ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch received email' });
    }
});

// POST /emails/webhook - Webhook to receive incoming emails from Resend or email webhook provider
router.post('/webhook', async (req, res) => {
    try {
        const payload = req.body || {};
        // Resend sends webhooks formatted as type: "email.received" or direct payload
        const emailData = payload.data || payload;

        const emailId = emailData.email_id || emailData.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const from = emailData.from || emailData.sender || 'unknown';
        const to = Array.isArray(emailData.to) ? emailData.to : [emailData.to || 'unknown'];
        const subject = emailData.subject || '';
        const text = emailData.text || '';
        const html = emailData.html || '';

        const savedEmail = await ReceivedEmail.findOneAndUpdate(
            { emailId },
            {
                emailId,
                from,
                to,
                subject,
                text,
                html,
                raw: payload,
                receivedAt: emailData.created_at ? new Date(emailData.created_at) : new Date()
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: 'Webhook processed successfully',
            email: savedEmail
        });
    } catch (error) {
        console.error('Error processing email webhook:', error);
        res.status(500).json({ error: 'Error processing email webhook' });
    }
});

module.exports = router;
