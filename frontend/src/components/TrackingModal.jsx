import React, { useState, useEffect } from 'react';
import api from '../api';
import { X } from 'lucide-react';

const TrackingModal = ({ onClose, onSave }) => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    contactId: '',
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
      await api.post('/followups', formData);
      onSave();
    } catch (error) {
      console.error('Error saving followup:', error);
      alert('Error guardando el seguimiento');
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
          
          <div className="input-group">
            <label>Contacto</label>
            <select required name="contactId" className="input-control" value={formData.contactId} onChange={handleChange}>
              <option value="">Seleccionar contacto...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone || 'Sin cel'})</option>
              ))}
            </select>
          </div>

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
            <label>Fecha de Próxima Acción</label>
            <input type="date" name="nextActionDate" className="input-control" value={formData.nextActionDate} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Notas de Seguimiento</label>
            <textarea name="notes" className="input-control" rows="3" value={formData.notes} onChange={handleChange} placeholder="Detalles de conversación, propuesta, etc."></textarea>
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
