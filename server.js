// ============================================
// ATTENDANCE SYSTEM - BACKEND SERVER
// ============================================

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// ============================================
// EMAIL CONFIGURATION
// ============================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log('⚠️  Email service not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env');
    } else {
        console.log('✅ Email service ready');
    }
});

// ============================================
// EMAIL TEMPLATES
// ============================================
const emailTemplates = {
    present: (student) => ({
        subject: `✅ Attendance Confirmation - ${student.studentName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f0ff; padding: 20px; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #9370db, #d8bfd8); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">✓ Present</h1>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #9370db; margin-top: 0;">Attendance Recorded</h2>
                    
                    <div style="background: #c8e6c9; padding: 15px; border-radius: 6px; border-left: 4px solid #4caf50; margin-bottom: 20px;">
                        <p style="margin: 0; color: #2e7d32; font-weight: bold;">✓ ${student.studentName} marked as PRESENT</p>
                    </div>
                    
                    <h3 style="color: #666; margin-top: 20px; margin-bottom: 10px;">Student Details:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #9370db;">Name:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${student.studentName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #9370db;">Student No.:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${student.studentNumber}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #9370db;">Section:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${student.section}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #9370db;">Time:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${student.date}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
                    <p>This is an automated message from the Student Attendance System</p>
                </div>
            </div>
        `
    }),

    absent: (student) => ({
        subject: `⚠️  ABSENT - ${student.studentName} Did Not Attend`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff3e0; padding: 20px; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #f44336, #ff7043); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">✗ ABSENT</h1>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #d32f2f; margin-top: 0;">⚠️  Absence Alert</h2>
                    
                    <div style="background: #ffcdd2; padding: 15px; border-radius: 6px; border-left: 4px solid #f44336; margin-bottom: 20px;">
                        <p style="margin: 0; color: #c62828; font-weight: bold;">Student ${student.studentName} is ABSENT today</p>
                    </div>
                    
                    <h3 style="color: #666; margin-top: 20px; margin-bottom: 10px;">Student Information:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ffcdd2; font-weight: bold; color: #d32f2f;">Name:</td>
                            <td style="padding: 10px; border: 1px solid #ffcdd2;">${student.studentName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ffcdd2; font-weight: bold; color: #d32f2f;">Student No.:</td>
                            <td style="padding: 10px; border: 1px solid #ffcdd2;">${student.studentNumber}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ffcdd2; font-weight: bold; color: #d32f2f;">Section:</td>
                            <td style="padding: 10px; border: 1px solid #ffcdd2;">${student.section}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ffcdd2; font-weight: bold; color: #d32f2f;">Time Marked:</td>
                            <td style="padding: 10px; border: 1px solid #ffcdd2;">${student.date}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ffcdd2; font-weight: bold; color: #d32f2f;">Contact:</td>
                            <td style="padding: 10px; border: 1px solid #ffcdd2;">${student.parentPhone}</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px; color: #666; font-style: italic;">
                        Please follow up with the student or parent/guardian if required.
                    </p>
                </div>
                
                <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ffcdd2; padding-top: 15px;">
                    <p>This is an automated absence notification from the Student Attendance System</p>
                </div>
            </div>
        `
    }),

    late: (student) => ({
        subject: `⏰ LATE - ${student.studentName} Arrived Late`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff8e1; padding: 20px; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #ff9800, #ffb74d); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">⏰ LATE</h1>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #e65100; margin-top: 0;">⏰ Late Arrival Alert</h2>
                    
                    <div style="background: #ffe0b2; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9800; margin-bottom: 20px;">
                        <p style="margin: 0; color: #e65100; font-weight: bold;">Student ${student.studentName} arrived LATE</p>
                    </div>
                    
                    <h3 style="color: #666; margin-top: 20px; margin-bottom: 10px;">Student Information:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ffe0b2; font-weight: bold; color: #e65100;">Name:</td>
                            <td style="padding: 10px; border: 1px solid #ffe0b2;">${student.studentName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ffe0b2; font-weight: bold; color: #e65100;">Student No.:</td>
                            <td style="padding: 10px; border: 1px solid #ffe0b2;">${student.studentNumber}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ffe0b2; font-weight: bold; color: #e65100;">Section:</td>
                            <td style="padding: 10px; border: 1px solid #ffe0b2;">${student.section}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ffe0b2; font-weight: bold; color: #e65100;">Arrival Time:</td>
                            <td style="padding: 10px; border: 1px solid #ffe0b2;">${student.date}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ffe0b2; font-weight: bold; color: #e65100;">Contact:</td>
                            <td style="padding: 10px; border: 1px solid #ffe0b2;">${student.parentPhone}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ffe0b2; padding-top: 15px;">
                    <p>This is an automated message from the Student Attendance System</p>
                </div>
            </div>
        `
    })
};

// ============================================
// API ENDPOINT - SEND EMAIL
// ============================================
app.post('/api/send-email', async (req, res) => {
    try {
        const { studentName, studentNumber, email, parentPhone, section, status, date } = req.body;

        // Validate required fields
        if (!studentName || !email || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const student = {
            studentName,
            studentNumber,
            email,
            parentPhone,
            section,
            status,
            date
        };

        // Select appropriate template
        const templateKey = status.toLowerCase();
        if (!emailTemplates[templateKey]) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const emailContent = emailTemplates[templateKey](student);

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@attendance.system',
            to: email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        await transporter.sendMail(mailOptions);

        console.log(`📧 Email sent to ${email} - Status: ${status}`);

        res.json({
            success: true,
            message: `Email notification sent to ${email}`,
            status: status
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        server: 'Attendance System API',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ROOT ROUTE
// ============================================
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Server error',
        message: err.message
    });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🎓 ATTENDANCE SYSTEM SERVER RUNNING');
    console.log('========================================');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`⏰ Started: ${new Date().toLocaleString()}`);
    console.log('========================================\n');
});
