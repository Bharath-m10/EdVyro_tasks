const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./internships.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// Schema & Seed Data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        domain TEXT NOT NULL
    )`);
    
    db.get("SELECT COUNT(*) AS count FROM internships", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO internships (role, company, domain) VALUES (?, ?, ?)");
            stmt.run("Frontend Intern", "TechCorp", "Frontend");
            stmt.run("Backend Engineering Intern", "DataSystems", "Backend");
            stmt.finalize();
        }
    });
});

// Validation Middleware
const validateInput = (req, res, next) => {
    const { role, company, domain } = req.body;
    if (!role || !company || !domain) {
        return res.status(400).json({ error: 'Role, company, and domain are required.' });
    }
    next();
};

// 1. List with Pagination
app.get('/api/internships', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    db.all(`SELECT * FROM internships LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ page, limit, data: rows });
    });
});

// 2. Detail
app.get('/api/internships/:id', (req, res) => {
    db.get(`SELECT * FROM internships WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    });
});

// 3. Create
app.post('/api/internships', validateInput, (req, res) => {
    const { role, company, domain } = req.body;
    db.run(`INSERT INTO internships (role, company, domain) VALUES (?, ?, ?)`, [role, company, domain], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, role, company, domain });
    });
});

// 4. Update
app.put('/api/internships/:id', validateInput, (req, res) => {
    const { role, company, domain } = req.body;
    db.run(`UPDATE internships SET role = ?, company = ?, domain = ? WHERE id = ?`, 
        [role, company, domain, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Updated successfully' });
    });
});

// 5. Delete
app.delete('/api/internships/:id', (req, res) => {
    db.run(`DELETE FROM internships WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
