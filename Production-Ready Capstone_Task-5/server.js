const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Meaningful Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Healthy', timestamp: new Date().toISOString() });
});

const db = new sqlite3.Database('./internships.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS internships (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, company TEXT, domain TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, internship_id INTEGER, name TEXT, email TEXT)`);
});

app.get('/api/internships', (req, res) => {
    db.all(`SELECT * FROM internships`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ data: rows });
    });
});

app.post('/api/apply', (req, res) => {
    const { internshipId, name, email } = req.body;
    if (!internshipId || !name || !email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid name, email, and internship ID required.' });
    }
    db.run(`INSERT INTO applications (internship_id, name, email) VALUES (?, ?, ?)`, [internshipId, name, email], function(err) {
            if (err) return res.status(500).json({ error: 'Submission failed' });
            res.status(201).json({ message: 'Success', id: this.lastID });
    });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
