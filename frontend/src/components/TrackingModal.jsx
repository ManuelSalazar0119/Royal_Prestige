import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, UserPlus, Users } from 'lucide-react';

const TrackingModal = ({ onClose, onSave }) => {
  const [contacts, setContacts] = useState([]);
  const [isNewContact, setIsNewContact] = useState(true);

  const [existingContactId, setExistingContactId] = useState('');
  const [newContactData, setNewContactData] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const [formData, setFormData] = useState({
    stage: 'Contacto Inicial',
    priority: 'Media',
    nextActionDate: '',
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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
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
        const contactRes = await api.post('/contacts', {
          name: newContactData.name,
          phone: newContactData.phone,
          relationship: newContactData.relationship,
          status: 'Pendiente'
        });
        finalContactId = contactRes.data.id;
      } else {
        if (!existingContactId) {
          alert("Por favor selecciona un contacto del directorio");
          return;
        }
      }

      await api.post('/followups', {
        contactId: finalContactId,
        stage: formData.stage,
        priority: formData.priority,
        nextActionDate: formData.nextActionDate,
        notes: formData.notes
      });

      onSave();
    } catch (error) {
      console.error('Error guardando seguimiento:', error);
      alert('Error al guardar el seguimiento');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nuevo Seguimiento Crystone</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>

          {/* Toggle Modo Contacto */}
          <div className="input-group">
            <label>¿A quién le harás seguimiento?</label>
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
                <input required type="text" name="name" className="input-control" placeholder="Ej. Mariana López" value={newContactData.name} onChange={handleNewContactChange} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
                <div className="input-group" style={{marginBottom: 0}}>
                  <label>Celular</label>
                  <input type="text" name="phone" className="input-control" placeholder="Ej. 311 987 6543" value={newContactData.phone} onChange={handleNewContactChange} />
                </div>
                <div className="input-group" style={{marginBottom: 0}}>
                  <label>Parentesco / Ref.</label>
                  <input type="text" name="relationship" className="input-control" placeholder="Ej. Cliente Crystone" value={newContactData.relationship} onChange={handleNewContactChange} />
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

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="input-group">
              <label>Etapa Inicial</label>
              <select name="stage" className="input-control" value={formData.stage} onChange={handleChange}>
                <option value="Contacto Inicial">Contacto Inicial</option>
                <option value="Presentación Realizada">Presentación Realizada</option>
                <option value="En Negociación">En Negociación</option>
                <option value="Cierre Exitoso">Cierre Exitoso</option>
              </select>
            </div>

            <div className="input-group">
              <label>Prioridad</label>
              <select name="priority" className="input-control" value={formData.priority} onChange={handleChange}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Fecha de Próxima Acción (Ej. Llamar en 2 semanas)</label>
            <input type="date" name="nextActionDate" className="input-control" value={formData.nextActionDate} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Notas de Seguimiento</label>
            <textarea name="notes" className="input-control" rows="2" value={formData.notes} onChange={handleChange} placeholder="Ej. Llamar en 2 semanas para confirmar cotización"></textarea>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn">Guardar Seguimiento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackingModal;
