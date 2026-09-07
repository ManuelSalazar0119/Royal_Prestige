const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendNotification = async (subject, text) => {
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'pon_aqui_tu_contraseña_de_aplicacion') {
        console.log(`[SIMULACIÓN EMAIL] Para enviar correo real, configura EMAIL_PASS en .env. 
Asunto: ${subject}
Texto: ${text}`);
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Enviamos el correo a ti mismo
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', subject);
    } catch (error) {
        console.error('Error enviando correo:', error);
    }
};

module.exports = { sendNotification };
