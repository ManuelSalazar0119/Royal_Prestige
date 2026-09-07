const cron = require('node-cron');
const db = require('../database');
const { sendNotification } = require('./emailService');

// Tarea ejecutada cada hora
cron.schedule('0 * * * *', () => {
    console.log('Ejecutando revisión de eventos con cron...');
    const now = new Date();
    const nowMs = now.getTime();
    const events = db.getEvents();

    events.forEach(event => {
        const eventDate = new Date(event.dateTime);
        const diffMs = eventDate.getTime() - nowMs;
        const diffHours = diffMs / (1000 * 60 * 60);

        // Recordatorio 24 horas antes
        if (diffHours > 23 && diffHours <= 24) {
            sendNotification(
                `Recordatorio 24h: ${event.type} con ${event.contactName}`,
                `Tienes programado(a) un(a) ${event.type} con ${event.contactName} el ${event.dateTime}.\nNotas: ${event.notes}`
            );
        }

        // Recordatorio 2 horas antes
        if (diffHours > 1 && diffHours <= 2) {
            sendNotification(
                `¡Atención! Recordatorio 2h: ${event.type} con ${event.contactName}`,
                `Faltan menos de 2 horas para tu ${event.type} con ${event.contactName} el ${event.dateTime}.\nNotas: ${event.notes}`
            );
        }
    });
});
