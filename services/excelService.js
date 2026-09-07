const xlsx = require('xlsx');
const db = require('../database');
const path = require('path');

const exportToExcel = (req, res) => {
    // Obtenemos todos los contactos
    db.all(`SELECT id, name as 'Nombre Completo', relationship as 'Parentesco', phone as 'Celular', 
            occupation as 'Ocupación', maritalStatus as 'Estado Civil', origin as 'Origen', status as 'Estatus' 
            FROM contacts`, [], (err, contacts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Obtenemos todos los eventos
        db.all(`SELECT events.id, contacts.name as 'Contacto', events.type as 'Tipo', 
                events.dateTime as 'Fecha y Hora', events.notes as 'Notas' 
                FROM events 
                JOIN contacts ON events.contactId = contacts.id`, [], (err, events) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const wb = xlsx.utils.book_new();
            
            // Hoja 1: Contactos
            const wsContacts = xlsx.utils.json_to_sheet(contacts);
            xlsx.utils.book_append_sheet(wb, wsContacts, "Contactos");

            // Hoja 2: Eventos
            const wsEvents = xlsx.utils.json_to_sheet(events);
            xlsx.utils.book_append_sheet(wb, wsEvents, "Eventos");

            // Escribimos a buffer y mandamos descarga
            const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
            
            res.setHeader('Content-Disposition', 'attachment; filename="Exportacion_Sistema.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        });
    });
};

module.exports = { exportToExcel };
