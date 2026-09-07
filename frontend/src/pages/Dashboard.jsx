import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CalendarDays, Briefcase, CalendarClock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ citasHoy: 0, entrevistasSemana: 0, totalContactos: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/events');
      // Filtramos solo futuros y tomamos los próximos 5
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
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <CalendarClock size={16} /> Citas para hoy
          </div>
          <div className="stat-value">{stats.citasHoy}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Briefcase size={16} /> Entrevistas de la semana
          </div>
          <div className="stat-value">{stats.entrevistasSemana}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Users size={16} /> Total de Contactos
          </div>
          <div className="stat-value">{stats.totalContactos}</div>
        </div>
      </div>

      <h2 style={{marginBottom: '1rem', fontWeight: 600}}>Próximos Eventos</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Contacto</th>
              <th>Tipo</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.length === 0 ? (
              <tr><td colSpan="3" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No hay eventos próximos</td></tr>
            ) : (
              upcomingEvents.map(event => (
                <tr key={event.id}>
                  <td style={{fontWeight: 500}}>{event.contactName}</td>
                  <td><span className={getBadgeClass(event.type)}>{event.type}</span></td>
                  <td>{new Date(event.dateTime).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</td>
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
