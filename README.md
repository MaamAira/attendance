# 📋 Student Attendance System

A modern web-based attendance tracking system with automatic email notifications, Excel export, and beautiful UI.

## ✨ Features

- 🎨 **Beautiful Lavender UI** - Modern, responsive design
- ✅ **Attendance Tracking** - Mark students as Present, Absent, or Late
- 📧 **Email Notifications** - Automatic alerts sent to students/parents
- 📊 **Excel Export** - Download reports with lavender color scheme
- 📍 **Section Organization** - Group records by student sections
- 💾 **LocalStorage** - Data persists across browser sessions
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 📦 Requirements

- Node.js (v14 or higher)
- npm or yarn
- Gmail account with App Password enabled

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone https://github.com/MaamAira/attendance.git
cd attendance

# Install dependencies
npm install
```

### 2. Setup Gmail Configuration

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy the generated app password
4. Create `.env` file in project root:

```bash
cp .env.example .env
```

5. Edit `.env` and add your Gmail credentials:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

Server runs on: **http://localhost:3000**

## 📖 How to Use

### Adding Attendance Records

1. **Select Section** - Choose from Section A, B, or C
2. **Enter Student Details**:
   - Student Name (required)
   - Student Number (optional)
   - Parent/Guardian Phone (required)
   - Email (required)
3. **Mark Status** - Click Present, Absent, or Late
4. **Submit** - Click "Add Attendance Record"

### Features

- **Email Alert**: Automatically sends email to student's email address
- **View Records**: See all records organized by section
- **Delete Record**: Remove incorrect entries
- **Export Excel**: Download report with color-coded status
- **Auto-Save**: Records saved in browser's localStorage

## 📧 Email Notifications

The system sends different email templates based on attendance status:

- ✅ **Present** - Green confirmation email
- ❌ **Absent** - Red alert email with contact information
- ⏰ **Late** - Orange warning email

Each email includes:
- Student name and number
- Section information
- Date and time
- Parent/Guardian contact number
- Professional HTML formatting

## 📊 Excel Export

Export attendance records with:
- ✅ Lavender color scheme
- 📑 Organized by sections
- 🎨 Color-coded status (Green/Red/Orange)
- 📄 Professional formatting
- 💾 Automatic download

## 🗂️ Project Structure

```
attendance/
├── index.html          # Main HTML interface
├── app.js             # Frontend JavaScript logic
├── server.js          # Express backend server
├── package.json       # Dependencies
├── .env.example       # Environment configuration template
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 🔧 Configuration

### Environment Variables (.env)

```
EMAIL_USER          - Gmail email address
EMAIL_PASSWORD      - Gmail app password
PORT               - Server port (default: 3000)
```

## 📝 API Endpoints

### POST /api/send-email
Sends email notification

**Request Body:**
```json
{
  "studentName": "John Doe",
  "studentNumber": "12345",
  "email": "student@example.com",
  "parentPhone": "555-1234",
  "section": "Section A",
  "status": "Present",
  "date": "5/22/2026"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email notification sent to student@example.com",
  "status": "Present"
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "running",
  "server": "Attendance System API",
  "timestamp": "2026-05-22T16:02:38Z"
}
```

## 🎯 Data Storage

Records are stored in browser's localStorage with the following structure:

```javascript
{
  id: 1716412958000,
  studentName: "John Doe",
  studentNumber: "12345",
  parentPhone: "555-1234",
  email: "student@example.com",
  section: "Section A",
  status: "Present",
  date: "5/22/2026",
  time: "4:02:38 PM"
}
```

## 🎨 UI Color Scheme

- **Primary**: Lavender (#c8a2e0)
- **Secondary**: Light Lavender (#d4b5f0)
- **Present**: Green (#90EE90)
- **Absent**: Red (#FFB6C1)
- **Late**: Orange (#FFD700)

## 🐛 Troubleshooting

### Email Not Sending
- Verify Gmail app password in `.env`
- Check email address format is correct
- Ensure 2FA is enabled on Gmail account
- Check browser console for errors

### Records Not Persisting
- Clear browser cache and reload
- Check if localStorage is enabled
- Try different browser if issue persists

### Server Won't Start
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is available

## 📄 License

MIT License - Feel free to use this project for educational purposes

## 👤 Author

Created for student attendance management

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Review console logs for error messages
4. Ensure all dependencies are installed

---

**Version:** 1.0.0  
**Last Updated:** 2026-05-22
