const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// @desc    Send contact/feedback email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"FarmLytics Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'farmlyticswork@gmail.com',
      replyTo: email,
      subject: `[FarmLytics Feedback] Message from ${name.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 20px; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="margin: 0;">🌾 New FarmLytics Feedback</h2>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 80px;">Name:</td>
                <td style="padding: 8px 0; color: #4b5563;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #4b5563;"><a href="mailto:${email}" style="color: #16a34a;">${email}</a></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Message:</p>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</p>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            Sent from FarmLytics Contact Form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { sendContactEmail };
