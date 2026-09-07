process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

// Inicializar DB y Cron
require('./database');
require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de comprobación de salud para Railway (Health Check)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api', apiRoutes);

// Servir frontend estático
const frontendDist = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendDist));

// Catch-all compatible con Express 5
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        const indexPath = path.join(frontendDist, 'index.html');
        res.sendFile(indexPath, (err) => {
            if (err) {
                res.status(200).send(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>Royal Prestige Manager</title></head>
                    <body style="font-family:sans-serif; text-align:center; padding:50px;">
                        <h1>Servidor Royal Prestige Activo ✅</h1>
                        <p>El backend y sistema de alertas por correo se están ejecutando correctamente.</p>
                    </body>
                    </html>
                `);
            }
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Royal Prestige corriendo en el puerto ${PORT}`);
});
