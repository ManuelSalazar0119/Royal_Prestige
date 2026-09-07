const express = require('express');
const router = express.Router();
const db = require('../database');
const { exportToExcel } = require('../services/excelService');

// --- CONTACTS ---
router.get('/contacts', (req, res) => {
    res.json(db.getContacts());
});

router.post('/contacts', (req, res) => {
    const newContact = db.addContact(req.body);
    res.json(newContact);
});

router.put('/contacts/:id', (req, res) => {
    const updated = db.updateContact(req.params.id, req.body);
    if (updated) {
        res.json(updated);
    } else {
        res.status(404).json({ error: 'Contacto no encontrado' });
    }
});

router.delete('/contacts/:id', (req, res) => {
    const result = db.deleteContact(req.params.id);
    res.json(result);
});

// --- EVENTS ---
router.get('/events', (req, res) => {
    res.json(db.getEvents());
});

router.post('/events', (req, res) => {
    const newEvent = db.addEvent(req.body);
    res.json(newEvent);
});

// --- FOLLOWUPS (SEGUIMIENTO) ---
router.get('/followups', (req, res) => {
    res.json(db.getFollowups());
});

router.post('/followups', (req, res) => {
    const newFollowup = db.addFollowup(req.body);
    res.json(newFollowup);
});

router.put('/followups/:id', (req, res) => {
    const updated = db.updateFollowupStage(req.params.id, req.body.stage);
    res.json(updated);
});

// --- EXPORT EXCEL ---
router.get('/export', exportToExcel);

// --- DASHBOARD STATS ---
router.get('/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const contacts = db.getContacts();
    const events = db.getEvents();
    const followups = db.getFollowups();

    const citasHoy = events.filter(e => e.type === 'Cita Regular' && e.dateTime.includes(today)).length;
    const entrevistasSemana = events.filter(e => e.type === 'Entrevista' && e.dateTime >= today).length;
    const totalContactos = contacts.length;
    const seguimientosActivos = followups.filter(f => f.stage !== 'Cierre Exitoso' && f.stage !== 'Archivado').length;

    res.json({ citasHoy, entrevistasSemana, totalContactos, seguimientosActivos });
});

module.exports = router;
