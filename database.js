const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.json');

const initialData = {
    contacts: [
        { id: 1, name: 'Ezequiel', relationship: '', phone: '', occupation: '', maritalStatus: '', origin: '', status: 'Pendiente' },
        { id: 2, name: 'Guadalupe', relationship: '', phone: '', occupation: '', maritalStatus: '', origin: '', status: 'Pendiente' },
        { id: 3, name: 'Ayme Veronica', relationship: '', phone: '', occupation: '', maritalStatus: '', origin: '', status: 'Pendiente' }
    ],
    events: [
        { id: 1, contactId: 1, type: 'Cita Regular', dateTime: '2026-09-07T13:00', notes: 'Vistas de la Cantera' },
        { id: 2, contactId: 2, type: 'Cita Regular', dateTime: '2026-09-09T16:00', notes: 'Nayarit y Yesca' },
        { id: 3, contactId: 3, type: 'Entrevista', dateTime: '2026-09-07T10:30', notes: '' }
    ]
};

function loadData() {
    if (!fs.existsSync(dbPath)) {
        saveData(initialData);
        return initialData;
    }
    try {
        const raw = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return initialData;
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('Error guardando la base de datos:', e);
    }
}

let currentData = loadData();

module.exports = {
    getContacts: () => currentData.contacts,
    addContact: (contactData) => {
        const nextId = currentData.contacts.reduce((max, c) => Math.max(max, c.id), 0) + 1;
        const newContact = {
            id: nextId,
            name: contactData.name || '',
            relationship: contactData.relationship || '',
            phone: contactData.phone || '',
            occupation: contactData.occupation || '',
            maritalStatus: contactData.maritalStatus || '',
            origin: contactData.origin || '',
            status: contactData.status || 'Pendiente'
        };
        currentData.contacts.push(newContact);
        saveData(currentData);
        return newContact;
    },
    getEvents: () => {
        return currentData.events.map(e => {
            const contact = currentData.contacts.find(c => Number(c.id) === Number(e.contactId));
            return {
                ...e,
                contactName: contact ? contact.name : 'Desconocido'
            };
        });
    },
    addEvent: (eventData) => {
        const nextId = currentData.events.reduce((max, ev) => Math.max(max, ev.id), 0) + 1;
        const newEvent = {
            id: nextId,
            contactId: Number(eventData.contactId),
            type: eventData.type || 'Cita Regular',
            dateTime: eventData.dateTime || '',
            notes: eventData.notes || ''
        };
        currentData.events.push(newEvent);
        saveData(currentData);
        return newEvent;
    }
};
