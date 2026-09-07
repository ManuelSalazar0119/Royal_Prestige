import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, CalendarDays, Briefcase, CalendarClock, GitCommit, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ citasHoy: 0, entrevistasSemana: 0, totalContactos: 0, seguimientosActivos: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      const future = res.data.filter(e => new Date(e.dateTime) >= new Date());
      setUpcomingEvents(future.slice(0, 5));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getBadgeClass = (type) => {
    return type === 'Cita Regular' ? 'badge badge-cita' : 'badge badge-entrevista';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel Crystone Executive</h1>
          <p className="page-subtitle">Bienvenido a la plataforma de gestión inteligente Crystone</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <CalendarClock size={16} style={{color: '#60a5fa'}} /> Citas para hoy
          </div>
          <div className="stat-value">{stats.citasHoy}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Briefcase size={16} style={{color: '#fb923c'}} /> Entrevistas de la semana
          </div>
          <div className="stat-value">{stats.entrevistasSemana}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Users size={16} style={{color: '#34d399'}} /> Total de Contactos
          </div>
          <div className="stat-value">{stats.totalContactos}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <GitCommit size={16} style={{color: '#c4b5fd'}} /> Seguimientos Activos
          </div>
          <div className="stat-value">{stats.seguimientosActivos}</div>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem'}}>
        <h2 style={{fontSize: '1.3rem', fontWeight: 700, color: 'white'}}>Próximos Eventos Programados</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Contacto</th>
              <th>Tipo de Evento</th>
              <th>Fecha y Hora</th>
              <th>Ubicación / Notas</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>No hay eventos próximos agendados</td></tr>
            ) : (
              upcomingEvents.map(event => (
                <tr key={event.id}>
                  <td style={{fontWeight: 600, color: 'white'}}>{event.contactName}</td>
                  <td><span className={getBadgeClass(event.type)}>{event.type}</span></td>
                  <td style={{color: '#cbd5e1'}}>{new Date(event.dateTime).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td style={{color: 'var(--text-muted)'}}>{event.notes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
