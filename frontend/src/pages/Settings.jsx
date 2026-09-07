import React from 'react';
import { Download, Mail, Server } from 'lucide-react';

const Settings = () => {
  const handleExport = () => {
    // Abrir la ruta de exportación en una nueva pestaña (descarga el archivo)
    window.open('http://localhost:3000/api/export', '_blank');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px'}}>
        
        {/* Exportación a Excel */}
        <div className="stat-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Download size={20} className="text-primary" /> Exportación de Datos
          </h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
            Descarga todos los contactos y eventos registrados en el sistema en un archivo de Excel (.xlsx).
          </p>
          <button className="btn" onClick={handleExport}>
            <Download size={18} /> Exportar a Excel
          </button>
        </div>

        {/* Notificaciones */}
        <div className="stat-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Mail size={20} className="text-primary" /> Configuración de Notificaciones (Email)
          </h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '1rem'}}>
            Las notificaciones se envían automáticamente al correo `ibared6@gmail.com` cuando faltan 24 y 2 horas para un evento.
          </p>
          <div style={{padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius)', border: '1px solid #bfdbfe', color: '#1e3a8a', fontSize: '0.875rem'}}>
            <strong>Instrucciones para activar el correo:</strong><br/>
            1. Ve a tu cuenta de Google (Seguridad).<br/>
            2. Activa la verificación en dos pasos.<br/>
            3. Crea una "Contraseña de Aplicación" para "Correo".<br/>
            4. Abre el archivo <code>backend/.env</code> en este proyecto.<br/>
            5. Pega esa contraseña en la variable <code>EMAIL_PASS</code> y reinicia el servidor.
          </div>
        </div>

        {/* Estatus del Sistema */}
        <div className="stat-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Server size={20} className="text-primary" /> Estatus del Sistema
          </h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '1rem'}}>
            Actualmente el sistema corre de manera local. Si apagas la computadora, las notificaciones se detendrán.
          </p>
          <p style={{color: 'var(--text-muted)'}}>
            <em>Sugerencia: Para mantenerlo 24/7, considera subir la carpeta <code>backend</code> a un servicio como Render o Railway.</em>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Settings;
