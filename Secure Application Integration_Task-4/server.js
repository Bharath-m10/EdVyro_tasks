const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 1. Security Middleware
app.use(helmet()); // Sets secure HTTP headers
app.use(cors());
app.use(express.json());

// 2. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use('/api/', limiter);

// Initialize SQLite Database
const db = new sqlite3.Database('./internships.db');

db.serialize(() => {
    // Existing internships table
    db.run(`CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT, company TEXT, domain TEXT
    )`);
    
    // New applications table
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        internship_id INTEGER,
        name TEXT,
        email TEXT
    )`);
});

// GET Internships Endpoint
app.get('/api/internships', (req, res) => {
    // 3. Parameterized queries (using ? to prevent SQL injection)
    db.all(`SELECT * FROM internships`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ data: rows });
    });
});

// POST Application Form Endpoint (Server-Side Validation)
app.post('/api/apply', (req, res) => {
    const { internshipId, name, email } = req.body;
    
    // Server-side validation
    if (!internshipId || !name || !email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid name, email, and internship ID are required.' });
    }

    // Parameterized query
    db.run(`INSERT INTO applications (internship_id, name, email) VALUES (?, ?, ?)`, 
        [internshipId, name, email], 
        function(err) {
            if (err) return res.status(500).json({ error: 'Failed to submit application' });
            res.status(201).json({ message: 'Application submitted successfully', id: this.lastID });
    });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
