const xlsx = require('xlsx');
const db = require('../database');

const exportToExcel = (req, res) => {
    try {
        const contacts = db.getContacts().map(c => ({
            'ID': c.id,
            'Nombre Completo': c.name,
            'Parentesco': c.relationship,
            'Celular': c.phone,
            'Ocupación': c.occupation,
            'Estado Civil': c.maritalStatus,
            'Origen': c.origin,
            'Estatus': c.status
        }));

        const events = db.getEvents().map(e => ({
            'ID': e.id,
            'Contacto': e.contactName,
            'Tipo': e.type,
            'Fecha y Hora': e.dateTime,
            'Notas': e.notes
        }));

        const wb = xlsx.utils.book_new();

        const wsContacts = xlsx.utils.json_to_sheet(contacts);
        xlsx.utils.book_append_sheet(wb, wsContacts, "Contactos");

        const wsEvents = xlsx.utils.json_to_sheet(events);
        xlsx.utils.book_append_sheet(wb, wsEvents, "Eventos");

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="Exportacion_Royal_Prestige.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { exportToExcel };
