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
    });
}

module.exports = db;
