const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        // Tabla de contactos
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            relationship TEXT,
            phone TEXT,
            occupation TEXT,
            maritalStatus TEXT,
            origin TEXT,
            status TEXT
        )`);

        // Tabla de eventos
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contactId INTEGER,
            type TEXT NOT NULL,
            dateTime TEXT NOT NULL,
            notes TEXT,
            FOREIGN KEY(contactId) REFERENCES contacts(id)
        )`);
        // Poblado inicial si la tabla está vacía
        db.get("SELECT COUNT(*) as count FROM contacts", (err, row) => {
            if (!err && row.count === 0) {
                db.run(`INSERT INTO contacts (name, relationship, phone, occupation, maritalStatus, origin, status) VALUES 
                    ('Ezequiel', '', '', '', '', '', 'Pendiente'),
                    ('Guadalupe', '', '', '', '', '', 'Pendiente'),
                    ('Ayme Veronica', '', '', '', '', '', 'Pendiente')`, function(err) {
                    if (!err) {
                        db.run(`INSERT INTO events (contactId, type, dateTime, notes) VALUES 
                            (1, 'Cita Regular', '2026-09-07T13:00', 'Vistas de la Cantera'),
                            (2, 'Cita Regular', '2026-09-09T16:00', 'Nayarit y Yesca'),
                            (3, 'Entrevista', '2026-09-07T10:30', '')`);
                    }
                });
            }
        });
    });
}

module.exports = db;
