import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, UserPlus, Users } from 'lucide-react';

const EventModal = ({ onClose, onSave }) => {
  const [contacts, setContacts] = useState([]);
  const [isNewContact, setIsNewContact] = useState(true);

  const [existingContactId, setExistingContactId] = useState('');
  const [newContactData, setNewContactData] = useState({
    name: '',
    phone: '',
    relationship: '',
    occupation: ''
  });

  const [eventData, setEventData] = useState({
    type: 'Cita Regular',
    dateTime: '',
    notes: ''
  });

  useEffect(() => {
    api.get('/contacts')
      .then(res => setContacts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleNewContactChange = (e) => {
    setNewContactData({...newContactData, [e.target.name]: e.target.value});
  };

  const handleEventChange = (e) => {
    setEventData({...eventData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalContactId = existingContactId;

      if (isNewContact) {
        if (!newContactData.name.trim()) {
          alert("Por favor ingresa el nombre del nuevo contacto");
          return;
        }
        // Crear contacto nuevo automáticamente
        const contactRes = await api.post('/contacts', {
          name: newContactData.name,
          phone: newContactData.phone,
          relationship: newContactData.relationship,
          occupation: newContactData.occupation,
          status: 'Pendiente'
        });
        finalContactId = contactRes.data.id;
      } else {
        if (!existingContactId) {
          alert("Por favor selecciona un contacto del directorio");
          return;
        }
      }

      // Crear evento vinculado al contacto
      await api.post('/events', {
        contactId: finalContactId,
        type: eventData.type,
        dateTime: eventData.dateTime,
        notes: eventData.notes
      });

      onSave();
    } catch (error) {
      console.error('Error agendando evento:', error);
      alert('Error al agendar el evento');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Agendar Nuevo Evento Crystone</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>

          {/* Toggle Modo Contacto */}
          <div className="input-group">
            <label>¿A quién agendarás?</label>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.35rem'}}>
              <button 
                type="button" 
                className={isNewContact ? 'btn' : 'btn btn-secondary'}
                style={{justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem'}}
                onClick={() => setIsNewContact(true)}>
                <UserPlus size={16} /> + Escribir Nuevo
              </button>
              <button 
                type="button" 
                className={!isNewContact ? 'btn' : 'btn btn-secondary'}
                style={{justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem'}}
                onClick={() => setIsNewContact(false)}>
                <Users size={16} /> Seleccionar Existente
              </button>
            </div>
          </div>

          {/* Formulario Contacto Nuevo */}
          {isNewContact ? (
            <div style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1.25rem'}}>
              <div className="input-group" style={{marginBottom: '0.75rem'}}>
                <label>Nombre Completo *</label>
                <input required type="text" name="name" className="input-control" placeholder="Ej. Carlos Mendoza" value={newContactData.name} onChange={handleNewContactChange} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
                <div className="input-group" style={{marginBottom: 0}}>
                  <label>Celular</label>
                  <input type="text" name="phone" className="input-control" placeholder="Ej. 311 123 4567" value={newContactData.phone} onChange={handleNewContactChange} />
                </div>
                <div className="input-group" style={{marginBottom: 0}}>
                  <label>Parentesco / Ref.</label>
                  <input type="text" name="relationship" className="input-control" placeholder="Ej. Vecino, Sobrino" value={newContactData.relationship} onChange={handleNewContactChange} />
                </div>
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label>Seleccionar Contacto Registrado</label>
              <select className="input-control" value={existingContactId} onChange={e => setExistingContactId(e.target.value)}>
                <option value="">Buscar en directorio...</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone || 'Sin cel'})</option>
                ))}
              </select>
            </div>
          )}

          {/* Datos del Evento */}
          <div className="input-group">
            <label>Tipo de Evento</label>
            <div style={{display: 'flex', gap: '1.5rem', marginTop: '0.35rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer'}}>
                <input type="radio" name="type" value="Cita Regular" checked={eventData.type === 'Cita Regular'} onChange={handleEventChange} />
                Cita Regular
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer'}}>
                <input type="radio" name="type" value="Entrevista" checked={eventData.type === 'Entrevista'} onChange={handleEventChange} />
                Entrevista
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Fecha y Hora *</label>
            <input required type="datetime-local" name="dateTime" className="input-control" value={eventData.dateTime} onChange={handleEventChange} />
          </div>

          <div className="input-group">
            <label>Notas adicionales / Ubicación</label>
            <textarea name="notes" className="input-control" rows="2" placeholder="Ej. Vistas de la Cantera" value={eventData.notes} onChange={handleEventChange}></textarea>
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
