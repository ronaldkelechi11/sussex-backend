const nodemailer = require('nodemailer');

function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create transporter as a singleton
let _transporter = null;
const getTransporter = () => {
    if (!_transporter) {
        _transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            pool: true, // Use pooled connections
            maxConnections: 5,
            maxMessages: 100
        });
    }
    return _transporter;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailWithRetry = async (mailOptions, maxRetries = 3, initialDelay = 1000) => {
    let lastError;
    const transporter = getTransporter();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Add timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Email sending timeout')), 30000)
            );

            const emailPromise = transporter.sendMail(mailOptions);
            const info = await Promise.race([emailPromise, timeoutPromise]);

            return {
                success: true,
                messageId: info.messageId,
                attempts: attempt
            };
        } catch (error) {
            lastError = error;
            console.warn(`Email sending attempt ${attempt} failed:`, error.message);

            if (attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
                await sleep(delay);
            }
        }
    }

    throw new Error(`Failed to send email after ${maxRetries} attempts. Last error: ${lastError.message}`);
};

const sendEmail = async (to, subject, text, html) => {
    if (!validateEmail(to)) {
        throw new Error('Invalid recipient email address');
    }

    const mailOptions = {
        from: `Andre from Sussex Logistics <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html
    };

    try {
        return await sendEmailWithRetry(mailOptions);
    } catch (error) {
        console.error('Email sending failed completely:', error);
        throw error;
    }
};

module.exports = {
    sendEmail,
    validateEmail
};
