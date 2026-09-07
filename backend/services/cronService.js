const cron = require('node-cron');
const db = require('../database');
const { sendNotification } = require('./emailService');

// Tarea ejecutada cada hora
cron.schedule('0 * * * *', () => {
    console.log('Running cron job to check upcoming events...');
    const now = new Date();
    const nowMs = now.getTime();

    db.all(`SELECT events.*, contacts.name as contactName 
            FROM events 
            JOIN contacts ON events.contactId = contacts.id`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(event => {
            const eventDate = new Date(event.dateTime);
            const diffMs = eventDate.getTime() - nowMs;
            const diffHours = diffMs / (1000 * 60 * 60);

            // Si faltan entre 23 y 24 horas
            if (diffHours > 23 && diffHours <= 24) {
                sendNotification(
                    `Recordatorio 24h: ${event.type} con ${event.contactName}`,
                    `Tienes programado(a) un(a) ${event.type} con ${event.contactName} el ${event.dateTime}.\nNotas: ${event.notes}`
                );
            }

            // Si faltan entre 1 y 2 horas
            if (diffHours > 1 && diffHours <= 2) {
                sendNotification(
                    `¡Atención! Recordatorio 2h: ${event.type} con ${event.contactName}`,
                    `Faltan menos de 2 horas para tu ${event.type} con ${event.contactName} el ${event.dateTime}.\nNotas: ${event.notes}`
                );
            }
        });
    });
});
