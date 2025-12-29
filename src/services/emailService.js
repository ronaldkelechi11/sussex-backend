const axios = require('axios');

function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailWithRetry = async (mailOptions, maxRetries = 3, initialDelay = 1000) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Add timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Email sending timeout')), 30000)
            );

            const emailPromise = axios.post(
                process.env.RESEND_API_URL || 'https://api.resend.com/emails',
                {
                    from: `Andre from Sussex Logistics <${process.env.SMTP_USER}>`,
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    text: mailOptions.text,
                    html: mailOptions.html
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const response = await Promise.race([emailPromise, timeoutPromise]);

            return {
                success: true,
                messageId: response.data.id,
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
