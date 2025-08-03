const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3001; // Or any port you like

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin if your frontend is on a different port

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or any SMTP host you use
  auth: {
    user: 'your-sender-email@gmail.com',
    pass: 'your-app-password', // Use App Password, not your main Gmail password
  },
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill all fields.' });
  }

  const mailOptions = {
    from: '"Aims Website" <your-sender-email@gmail.com>', // sender address
    to: 'aimstechnologies@aimstpl.com', // your receiving email
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h3>Contact Form Submission</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Message:</b></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ error: 'Email not sent. Try again later.' });
    }
    res.json({ success: true, message: 'Message sent successfully!' });
  });
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('Aims Contact API Running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
