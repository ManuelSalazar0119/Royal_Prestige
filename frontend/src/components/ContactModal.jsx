import React, { useState } from 'react';
import api from '../api';
import { X } from 'lucide-react';

const ContactModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    occupation: '',
    maritalStatus: '',
    origin: '',
    status: 'Pendiente'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contacts', formData);
      onSave();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error guardando el contacto');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nuevo Contacto Crystone</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre Completo</label>
            <input required type="text" name="name" className="input-control" value={formData.name} onChange={handleChange} />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="input-group">
              <label>Parentesco (Ej. Amiga de Lupita)</label>
              <input type="text" name="relationship" className="input-control" value={formData.relationship} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Celular</label>
              <input required type="text" name="phone" className="input-control" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="input-group">
              <label>Ocupación</label>
              <input type="text" name="occupation" className="input-control" value={formData.occupation} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Estado Civil</label>
              <select name="maritalStatus" className="input-control" value={formData.maritalStatus} onChange={handleChange}>
                <option value="">Seleccione...</option>
                <option value="Soltero(a)">Soltero(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viudo(a)">Viudo(a)</option>
              </select>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="input-group">
              <label>Origen (Ej. Referidos)</label>
              <input type="text" name="origin" className="input-control" value={formData.origin} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Estatus</label>
              <select required name="status" className="input-control" value={formData.status} onChange={handleChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="Aceptada">Aceptada</option>
                <option value="Denegada">Denegada</option>
              </select>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn">Guardar Contacto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
