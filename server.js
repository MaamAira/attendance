const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test email configuration
transporter.verify((error) => {
    if (error) {
        console.warn('⚠️  Email service not configured. Check .env file');
    } else {
        console.log('✅ Email service ready');
    }
});

/**
 * Serve index page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Send attendance email notification
 */
app.post('/api/send-email', async (req, res) => {
    try {
        const { studentName, studentNumber, email, parentPhone, section, status, date, time } = req.body;

        let subject = '';
        let htmlContent = '';
        let statusColor = '';
        let statusIcon = '';

        // Customize email based on status
        if (status === 'Present') {
            subject = `✓ Attendance Confirmed - ${studentName} Present on ${date}`;
            statusColor = '#4CAF50';
            statusIcon = '✓';
            htmlContent = `
                <p>Good news! <strong>${studentName}</strong> has been marked as <strong style="color: ${statusColor};">PRESENT</strong>.</p>
                <p>Thank you for attending class today!</p>
            `;
        } else if (status === 'Absent') {
            subject = `⚠️  Absence Alert - ${studentName} Absent on ${date}`;
            statusColor = '#F44336';
            statusIcon = '✗';
            htmlContent = `
                <p style="color: ${statusColor}; font-weight: bold;">⚠️ ABSENCE ALERT</p>
                <p>Student <strong>${studentName}</strong> was marked as <strong style="color: ${statusColor};">ABSENT</strong> on ${date}.</p>
                <p>Please contact the school if this is an error.</p>
            `;
        } else if (status === 'Late') {
            subject = `⏰ Late Attendance - ${studentName} Arrived Late on ${date}`;
            statusColor = '#FF9800';
            statusIcon = '⏰';
            htmlContent = `
                <p>Student <strong>${studentName}</strong> was marked as <strong style="color: ${statusColor};">LATE</strong>.</p>
                <p>Arrival time: ${time}</p>
                <p>Please ensure timely attendance going forward.</p>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #c8a2e0 0%, #d4b5f0 100%); color: white; padding: 30px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .content { padding: 30px; color: #333; line-height: 1.6; }
                        .status-box { background: #f9f9f9; border-left: 5px solid ${statusColor}; padding: 15px; margin: 20px 0; border-radius: 5px; }
                        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .details p { margin: 10px 0; }
                        .label { font-weight: bold; color: #4a3d6b; }
                        .footer { background: #f0e6ff; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0d5f0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📚 Attendance System</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #4a3d6b;">Attendance Notification</h2>
                            
                            <div class="status-box">
                                <p style="margin: 0; font-size: 18px;"><strong style="color: ${statusColor};">${statusIcon} Status: ${status}</strong></p>
                            </div>

                            <div class="details">
                                <p><span class="label">Student Name:</span> ${studentName}</p>
                                <p><span class="label">Student Number:</span> ${studentNumber}</p>
                                <p><span class="label">Section:</span> ${section}</p>
                                <p><span class="label">Date:</span> ${date}</p>
                                <p><span class="label">Time:</span> ${time}</p>
                                <p><span class="label">Parent Contact:</span> ${parentPhone}</p>
                            </div>

                            <div>
                                ${htmlContent}
                            </div>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from the Student Attendance System.</p>
                            <p>Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${email} - Status: ${status}`);

        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Error handling
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║  🎓 Attendance System Server Running       ║
║  📍 http://localhost:${PORT}                  ║
║  ✅ Ready to track attendance              ║
╚════════════════════════════════════════════╝
    `);
});

module.exports = app;
