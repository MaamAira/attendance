// Store attendance records
let attendanceRecords = [];
let selectedStatus = null;

// DOM Elements
const studentNameInput = document.getElementById('studentName');
const studentNumberInput = document.getElementById('studentNumber');
const parentPhoneInput = document.getElementById('parentPhone');
const emailInput = document.getElementById('email');
const sectionSelect = document.getElementById('section');
const addBtn = document.getElementById('addBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const alertBox = document.getElementById('alert');
const tableSection = document.getElementById('tableSection');
const sectionContainer = document.getElementById('sectionContainer');
const statusButtons = document.querySelectorAll('.status-btn');

// Event Listeners
statusButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        statusButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedStatus = this.dataset.status;
    });
});

addBtn.addEventListener('click', addAttendance);
exportBtn.addEventListener('click', exportToExcel);
clearBtn.addEventListener('click', clearForm);

// Load records from localStorage on page load
window.addEventListener('load', loadRecords);

/**
 * Add attendance record
 */
function addAttendance() {
    // Validation
    if (!studentNameInput.value.trim()) {
        showAlert('Please enter student name', 'error');
        return;
    }
    if (!parentPhoneInput.value.trim()) {
        showAlert('Please enter parent phone number', 'error');
        return;
    }
    if (!emailInput.value.trim()) {
        showAlert('Please enter email address', 'error');
        return;
    }
    if (!sectionSelect.value) {
        showAlert('Please select a section', 'error');
        return;
    }
    if (!selectedStatus) {
        showAlert('Please select attendance status', 'error');
        return;
    }

    // Create attendance record
    const record = {
        id: Date.now(),
        studentName: studentNameInput.value.trim(),
        studentNumber: studentNumberInput.value.trim() || 'N/A',
        parentPhone: parentPhoneInput.value.trim(),
        email: emailInput.value.trim(),
        section: sectionSelect.value,
        status: selectedStatus,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };

    // Add to records array
    attendanceRecords.push(record);

    // Save to localStorage
    saveRecords();

    // Send email notification
    sendEmailNotification(record);

    // Update table display
    renderTable();

    // Show success message
    showAlert(`Attendance recorded for ${record.studentName} - ${record.status}`, 'success');

    // Clear form
    clearForm();
}

/**
 * Send email notification
 */
function sendEmailNotification(record) {
    const emailData = {
        studentName: record.studentName,
        status: record.status,
        date: record.date,
        time: record.time,
        parentPhone: record.parentPhone,
        email: record.email,
        studentNumber: record.studentNumber,
        section: record.section
    };

    // Send email via server
    fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Email notification sent to:', record.email);
        }
    })
    .catch(error => console.error('Error sending email:', error));
}

/**
 * Render attendance table grouped by section
 */
function renderTable() {
    if (attendanceRecords.length === 0) {
        tableSection.style.display = 'none';
        return;
    }

    tableSection.style.display = 'block';
    sectionContainer.innerHTML = '';

    // Group records by section
    const groupedBySection = {};
    attendanceRecords.forEach(record => {
        if (!groupedBySection[record.section]) {
            groupedBySection[record.section] = [];
        }
        groupedBySection[record.section].push(record);
    });

    // Render each section
    Object.keys(groupedBySection).forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.style.marginBottom = '30px';

        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = `📚 ${section} (${groupedBySection[section].length} students)`;

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Table header
        thead.innerHTML = `
            <tr>
                <th>Student Name</th>
                <th>Student Number</th>
                <th>Parent Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
            </tr>
        `;

        // Table body
        groupedBySection[section].forEach(record => {
            const tr = document.createElement('tr');
            const statusClass = record.status.toLowerCase();
            tr.innerHTML = `
                <td><strong>${record.studentName}</strong></td>
                <td>${record.studentNumber}</td>
                <td>${record.parentPhone}</td>
                <td>${record.email}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td>${record.date}</td>
                <td>${record.time}</td>
                <td><button class="action-btn" onclick="deleteRecord(${record.id})">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        sectionDiv.appendChild(sectionTitle);
        sectionDiv.appendChild(table);
        sectionContainer.appendChild(sectionDiv);
    });
}

/**
 * Delete attendance record
 */
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        attendanceRecords = attendanceRecords.filter(record => record.id !== id);
        saveRecords();
        renderTable();
        showAlert('Record deleted successfully', 'success');
    }
}

/**
 * Clear form
 */
function clearForm() {
    studentNameInput.value = '';
    studentNumberInput.value = '';
    parentPhoneInput.value = '';
    emailInput.value = '';
    sectionSelect.value = '';
    selectedStatus = null;
    statusButtons.forEach(btn => btn.classList.remove('active'));
}

/**
 * Show alert message
 */
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;

    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

/**
 * Save records to localStorage
 */
function saveRecords() {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
}

/**
 * Load records from localStorage
 */
function loadRecords() {
    const saved = localStorage.getItem('attendanceRecords');
    if (saved) {
        attendanceRecords = JSON.parse(saved);
        renderTable();
    }
}

/**
 * Export to Excel with lavender styling
 */
function exportToExcel() {
    if (attendanceRecords.length === 0) {
        showAlert('No records to export', 'error');
        return;
    }

    // Get data grouped by section
    const groupedBySection = {};
    attendanceRecords.forEach(record => {
        if (!groupedBySection[record.section]) {
            groupedBySection[record.section] = [];
        }
        groupedBySection[record.section].push(record);
    });

    // Create HTML table for export
    let html = `
        <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <meta charset="UTF-8">
            <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-bottom: 20px;
                }
                th {
                    background-color: #c8a2e0;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    border: 1px solid #999;
                    font-weight: bold;
                }
                td {
                    padding: 8px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background-color: #f0e6ff;
                }
                tr:nth-child(odd) {
                    background-color: #faf8ff;
                }
                .section-title {
                    background-color: #d4b5f0;
                    color: white;
                    padding: 10px;
                    font-weight: bold;
                    margin-top: 10px;
                }
                .present { background-color: #90EE90; }
                .absent { background-color: #FFB6C1; }
                .late { background-color: #FFD700; }
            </style>
        </head>
        <body>
            <h2 style="color: #4a3d6b;">Student Attendance Report</h2>
            <p>Generated: ${new Date().toLocaleString()}</p>
    `;

    // Add tables for each section
    Object.keys(groupedBySection).forEach(section => {
        html += `<div class="section-title">${section}</div>`;
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student Number</th>
                        <th>Parent Phone</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
        `;

        groupedBySection[section].forEach(record => {
            const statusClass = record.status.toLowerCase();
            html += `
                <tr>
                    <td>${record.studentName}</td>
                    <td>${record.studentNumber}</td>
                    <td>${record.parentPhone}</td>
                    <td>${record.email}</td>
                    <td class="${statusClass}">${record.status}</td>
                    <td>${record.date}</td>
                    <td>${record.time}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    });

    html += `</body></html>`;

    // Create and download file
    const element = document.createElement('a');
    element.href = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);
    element.download = `Attendance_Report_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showAlert('Attendance report exported successfully!', 'success');
}
