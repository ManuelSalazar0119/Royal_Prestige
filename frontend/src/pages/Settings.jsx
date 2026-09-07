import React from 'react';
import { Download, Mail, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const handleExport = () => {
    const exportUrl = window.location.hostname === 'localhost' && window.location.port === '5173'
      ? 'http://localhost:3000/api/export'
      : '/api/export';
    window.open(exportUrl, '_blank');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración Crystone</h1>
          <p className="page-subtitle">Sincronización y estado de la plataforma</p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem', maxWidth: '850px'}}>
        
        {/* Exportación a Excel */}
        <div className="stat-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white'}}>
            <Download size={22} style={{color: '#10b981'}} /> Exportación Completa Crystone (Excel)
          </h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.925rem'}}>
            Descarga todas las hojas de datos (Contactos, Citas/Entrevistas y Seguimientos Crystone) en un solo libro ejecutable de Excel (.xlsx).
          </p>
          <button className="btn" onClick={handleExport}>
            <Download size={18} /> Exportar Excel (.xlsx)
          </button>
        </div>

        {/* Notificaciones Email */}
        <div className="stat-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white'}}>
            <Mail size={22} style={{color: '#06b6d4'}} /> Sistema de Alertas Automáticas (Email)
          </h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.925rem'}}>
            Tus notificaciones activas se envían a <strong>ibared6@gmail.com</strong> exactamente a las 24 horas y 2 horas antes de cada cita o entrevista.
          </p>
          <div style={{padding: '1.25rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.875rem'}}>
            <strong>Estado del servicio:</strong> Activo y verificado con Nodemailer.
          </div>
        </div>

        {/* Estado en la Nube */}
        <div className="stat-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white'}}>
            <ShieldCheck size={22} style={{color: '#f59e0b'}} /> Plataforma Nube 24/7
          </h2>
          <p style={{color: 'var(--text-muted)', fontSize: '0.925rem'}}>
            El backend Crystone se sincroniza de forma segura con tu repositorio en GitHub y opera de forma ininterrumpida.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Settings;
