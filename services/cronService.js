const cron = require('node-cron');
const db = require('../database');
const { sendNotification } = require('./emailService');

// Conjunto para evitar notificaciones duplicadas en el mismo día
const notifiedFollowups = new Set();

// 1. REVISIÓN CADA HORA: Citas, Entrevistas y Seguimientos
cron.schedule('0 * * * *', () => {
    console.log('🔍 Ejecutando revisión horaria Crystone...');
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const nowMs = now.getTime();

    // --- REVISIÓN DE CITAS Y ENTREVISTAS ---
    const events = db.getEvents();
    events.forEach(event => {
        const eventDate = new Date(event.dateTime);
        const diffMs = eventDate.getTime() - nowMs;
        const diffHours = diffMs / (1000 * 60 * 60);

        // Recordatorio 24 horas antes
        if (diffHours > 23 && diffHours <= 24) {
            sendNotification(
                `📌 Recordatorio 24h: ${event.type} con ${event.contactName}`,
                `Hola,\n\nTienes programado(a) un(a) ${event.type} con ${event.contactName} el ${event.dateTime}.\nUbicación / Notas: ${event.notes || 'Sin notas'}\n\nAtentamente,\nSistema Crystone Executive`
            );
        }

        // Recordatorio 2 horas antes
        if (diffHours > 1 && diffHours <= 2) {
            sendNotification(
                `⚡ ¡ALERTA 2 HORAS! ${event.type} con ${event.contactName}`,
                `Atención,\n\nFaltan menos de 2 horas para tu ${event.type} con ${event.contactName}.\nFecha y Hora: ${event.dateTime}\nNotas: ${event.notes || 'Sin notas'}\n\nAtentamente,\nSistema Crystone Executive`
            );
        }
    });

    // --- REVISIÓN DE SEGUIMIENTOS (FOLLOW-UPS) ---
    const followups = db.getFollowups();
    followups.forEach(followup => {
        if (!followup.nextActionDate) return;

        const notifKey = `${followup.id}_${todayStr}`;
        if (notifiedFollowups.has(notifKey)) return;

        // Si la fecha de próxima acción es HOY
        if (followup.nextActionDate === todayStr) {
            sendNotification(
                `🎯 SEGUIMIENTO CRYSTONE HOY: ${followup.contactName}`,
                `Hola,\n\nHoy tienes programada una acción de seguimiento con ${followup.contactName}.\n\n- Etapa: ${followup.stage}\n- Prioridad: ${followup.priority}\n- Notas de acción: ${followup.notes || 'Sin notas'}\n\nAtentamente,\nSistema Crystone Executive`
            );
            notifiedFollowups.add(notifKey);
        }
    });
});

// 2. RESUMEN MATUTINO DIARIO (Todos los días a las 8:00 AM)
cron.schedule('0 8 * * *', () => {
    console.log('☀️ Enviando resumen diario matutino Crystone...');
    const todayStr = new Date().toISOString().split('T')[0];
    const events = db.getEvents().filter(e => e.dateTime.includes(todayStr));
    const followups = db.getFollowups().filter(f => f.nextActionDate === todayStr);

    let summaryText = `☀️ RESUMEN DIARIO CRYSTONE - ${todayStr}\n\n`;
    
    summaryText += `📅 CITAS Y ENTREVISTAS DE HOY (${events.length}):\n`;
    if (events.length === 0) {
        summaryText += `- No tienes citas programadas para hoy.\n`;
    } else {
        events.forEach(e => {
            summaryText += `- [${e.type}] con ${e.contactName} a las ${new Date(e.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${e.notes || 'Sin notas'})\n`;
        });
    }

    summaryText += `\n🎯 SEGUIMIENTOS PROGRAMADOS PARA HOY (${followups.length}):\n`;
    if (followups.length === 0) {
        summaryText += `- No tienes seguimientos pendientes para hoy.\n`;
    } else {
        followups.forEach(f => {
            summaryText += `- ${f.contactName} (${f.stage}) - Prioridad: ${f.priority} - ${f.notes}\n`;
        });
    }

    summaryText += `\n¡Que tengas un día exitoso!\nSistema Crystone Executive`;

    sendNotification(`☀️ Agenda Diaria Crystone - ${todayStr}`, summaryText);
});
