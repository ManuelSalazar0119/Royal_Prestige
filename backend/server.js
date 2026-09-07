require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

// Inicializamos base de datos (creación de tablas)
require('./database');
// Inicializamos el servicio cron (empieza a ejecutarse en background)
require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Servir el frontend en producción
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
            if (err) {
                res.status(404).send("Front-end no compilado todavía");
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

