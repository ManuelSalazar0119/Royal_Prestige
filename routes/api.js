const express = require('express');
const router = express.Router();
const db = require('../database');
const { exportToExcel } = require('../services/excelService');

// --- CONTACTS ---

// GET /api/contacts
router.get('/contacts', (req, res) => {
    res.json(db.getContacts());
});

// POST /api/contacts
router.post('/contacts', (req, res) => {
    const newContact = db.addContact(req.body);
    res.json(newContact);
});

// --- EVENTS ---

// GET /api/events
router.get('/events', (req, res) => {
    res.json(db.getEvents());
});

// POST /api/events
router.post('/events', (req, res) => {
    const newEvent = db.addEvent(req.body);
    res.json(newEvent);
});

// --- EXPORT EXCEL ---
router.get('/export', exportToExcel);

// --- DASHBOARD STATS ---
router.get('/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const contacts = db.getContacts();
    const events = db.getEvents();

    const citasHoy = events.filter(e => e.type === 'Cita Regular' && e.dateTime.includes(today)).length;
    const entrevistasSemana = events.filter(e => e.type === 'Entrevista' && e.dateTime >= today).length;
    const totalContactos = contacts.length;

    res.json({ citasHoy, entrevistasSemana, totalContactos });
});

module.exports = router;
