import React, { useState, useEffect } from 'react';
import api from '../api';
import { CalendarDays, Plus, List } from 'lucide-react';
import EventModal from '../components/EventModal';

const Appointments = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
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
          <h1 className="page-title">Gestor de Citas y Entrevistas</h1>
          <p className="page-subtitle">Agenda ejecutiva de reuniones Crystone</p>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Agendar Evento
        </button>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
        <button className={viewMode === 'list' ? 'btn' : 'btn btn-secondary'} onClick={() => setViewMode('list')}>
          <List size={18} /> Lista
        </button>
        <button className={viewMode === 'calendar' ? 'btn' : 'btn btn-secondary'} onClick={() => setViewMode('calendar')}>
          <CalendarDays size={18} /> Vista General
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Contacto</th>
              <th>Tipo de Evento</th>
              <th>Fecha y Hora</th>
              <th>Notas adicionales</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>No hay eventos registrados</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id}>
                  <td style={{color: 'var(--text-dim)', fontWeight: 600}}>#{event.id.toString().padStart(4, '0')}</td>
                  <td style={{fontWeight: 600, color: 'white'}}>{event.contactName}</td>
                  <td><span className={getBadgeClass(event.type)}>{event.type}</span></td>
                  <td style={{color: '#cbd5e1'}}>{new Date(event.dateTime).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</td>
                  <td style={{color: 'var(--text-muted)'}}>{event.notes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <EventModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => {
            setIsModalOpen(false);
            fetchEvents();
          }} 
        />
      )}
    </div>
  );
};

export default Appointments;
