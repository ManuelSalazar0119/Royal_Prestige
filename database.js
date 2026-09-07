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
    ],
    followups: [
        { id: 1, contactId: 1, stage: 'Presentación Realizada', priority: 'Alta', nextActionDate: '2026-09-08', notes: 'Enviar catálogo Crystone y propuesta personalizada' },
        { id: 2, contactId: 2, stage: 'Contacto Inicial', priority: 'Media', nextActionDate: '2026-09-10', notes: 'Llamada de confirmación previa a la reunión' },
        { id: 3, contactId: 3, stage: 'En Negociación', priority: 'Alta', nextActionDate: '2026-09-07', notes: 'Entrevista de selección Crystone' }
    ]
};

function loadData() {
    if (!fs.existsSync(dbPath)) {
        saveData(initialData);
        return initialData;
    }
    try {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (!parsed.followups) parsed.followups = initialData.followups;
        return parsed;
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
    },
    getFollowups: () => {
        return currentData.followups.map(f => {
            const contact = currentData.contacts.find(c => Number(c.id) === Number(f.contactId));
            return {
                ...f,
                contactName: contact ? contact.name : 'Desconocido',
                contactPhone: contact ? contact.phone : ''
            };
        });
    },
    addFollowup: (followupData) => {
        const nextId = currentData.followups.reduce((max, f) => Math.max(max, f.id), 0) + 1;
        const newFollowup = {
            id: nextId,
            contactId: Number(followupData.contactId),
            stage: followupData.stage || 'Contacto Inicial',
            priority: followupData.priority || 'Media',
            nextActionDate: followupData.nextActionDate || '',
            notes: followupData.notes || ''
        };
        currentData.followups.push(newFollowup);
        saveData(currentData);
        return newFollowup;
    },
    updateFollowupStage: (id, stage) => {
        const item = currentData.followups.find(f => Number(f.id) === Number(id));
        if (item) {
            item.stage = stage;
            saveData(currentData);
        }
        return item;
    }
};
