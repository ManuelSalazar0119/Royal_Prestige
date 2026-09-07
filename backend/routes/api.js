const express = require('express');
const router = express.Router();
const db = require('../database');
const { exportToExcel } = require('../services/excelService');

// --- CONTACTS ---

// GET /api/contacts
router.get('/contacts', (req, res) => {
    db.all('SELECT * FROM contacts', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /api/contacts
router.post('/contacts', (req, res) => {
    const { name, relationship, phone, occupation, maritalStatus, origin, status } = req.body;
    db.run(
        `INSERT INTO contacts (name, relationship, phone, occupation, maritalStatus, origin, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, relationship, phone, occupation, maritalStatus, origin, status],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...req.body });
        }
    );
});

// --- EVENTS ---

// GET /api/events
router.get('/events', (req, res) => {
    db.all(`SELECT events.*, contacts.name as contactName 
            FROM events 
            LEFT JOIN contacts ON events.contactId = contacts.id 
            ORDER BY events.dateTime ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /api/events
router.post('/events', (req, res) => {
    const { contactId, type, dateTime, notes } = req.body;
    db.run(
        `INSERT INTO events (contactId, type, dateTime, notes) VALUES (?, ?, ?, ?)`,
        [contactId, type, dateTime, notes],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...req.body });
        }
    );
});

// --- EXPORT EXCEL ---
router.get('/export', exportToExcel);

// --- DASHBOARD STATS ---
router.get('/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Simplificación: usando sentencias SQLite
    // Citas para hoy (donde dateTime contenga la fecha de hoy)
    const stats = {};
    
    db.get(`SELECT COUNT(*) as count FROM events WHERE type = 'Cita Regular' AND dateTime LIKE ?`, ['%' + today + '%'], (err, row) => {
        stats.citasHoy = row ? row.count : 0;
        
        db.get(`SELECT COUNT(*) as count FROM contacts`, [], (err, row) => {
            stats.totalContactos = row ? row.count : 0;
            
            // Entrevistas semana (aproximación para demo: todas las entrevistas futuras)
            db.get(`SELECT COUNT(*) as count FROM events WHERE type = 'Entrevista' AND dateTime >= ?`, [today], (err, row) => {
                stats.entrevistasSemana = row ? row.count : 0;
                res.json(stats);
            });
        });
    });
});

module.exports = router;
