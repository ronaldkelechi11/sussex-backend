const nodemailer = require('nodemailer');

function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
    if (!validateEmail(to)) {
        throw new Error('Invalid recipient email address');
    }

    try {
        const mailOptions = {
            from: `Andre from Sussex Logistics <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = {
    sendEmail,
    validateEmail
};
