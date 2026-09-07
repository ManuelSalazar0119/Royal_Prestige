import React, { useState, useEffect } from 'react';
import api from '../api';
import { X } from 'lucide-react';

const EventModal = ({ onClose, onSave }) => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    contactId: '',
    type: 'Cita Regular',
    dateTime: '',
    notes: ''
  });

  useEffect(() => {
    api.get('/contacts')
      .then(res => setContacts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactId) {
      alert("Debe seleccionar un contacto");
      return;
    }
    try {
      await api.post('/events', formData);
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error guardando el evento');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Agendar Evento Crystone</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Contacto</label>
            <select required name="contactId" className="input-control" value={formData.contactId} onChange={handleChange}>
              <option value="">Buscar y seleccionar contacto...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone || 'Sin cel'})</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Tipo de Evento</label>
            <div style={{display: 'flex', gap: '1.5rem', marginTop: '0.5rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400, color: 'white'}}>
                <input type="radio" name="type" value="Cita Regular" checked={formData.type === 'Cita Regular'} onChange={handleChange} />
                Cita Regular
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400, color: 'white'}}>
                <input type="radio" name="type" value="Entrevista" checked={formData.type === 'Entrevista'} onChange={handleChange} />
                Entrevista
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Fecha y Hora</label>
            <input required type="datetime-local" name="dateTime" className="input-control" value={formData.dateTime} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Notas adicionales / Ubicación</label>
            <textarea name="notes" className="input-control" rows="3" value={formData.notes} onChange={handleChange}></textarea>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn">Agendar Evento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
