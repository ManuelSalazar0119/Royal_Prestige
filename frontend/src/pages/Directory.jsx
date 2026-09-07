import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import ContactModal from '../components/ContactModal';

const Directory = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleCreateNew = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este contacto?")) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Aceptada': return 'badge badge-aceptada';
      case 'Denegada': return 'badge badge-denegada';
      case 'Pendiente': return 'badge badge-pendiente';
      default: return 'badge';
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Directorio de Contactos</h1>
          <p className="page-subtitle">Base de datos centralizada Crystone</p>
        </div>
        <button className="btn" onClick={handleCreateNew}>
          <Plus size={18} /> Nuevo Contacto
        </button>
      </div>

      <div style={{marginBottom: '1.5rem', position: 'relative', maxWidth: '420px'}}>
        <div style={{position: 'absolute', top: '12px', left: '14px', color: 'var(--text-muted)'}}>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre o teléfono..." 
          className="input-control" 
          style={{paddingLeft: '2.75rem'}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Celular</th>
              <th>Parentesco</th>
              <th>Ocupación</th>
              <th>Estatus</th>
              <th style={{textAlign: 'right'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>No se encontraron contactos</td></tr>
            ) : (
              filteredContacts.map(contact => (
                <tr key={contact.id}>
                  <td style={{color: 'var(--text-dim)', fontWeight: 600}}>#{contact.id.toString().padStart(4, '0')}</td>
                  <td style={{fontWeight: 600, color: 'white'}}>{contact.name}</td>
                  <td style={{color: '#cbd5e1'}}>{contact.phone || '-'}</td>
                  <td style={{color: 'var(--text-muted)'}}>{contact.relationship || '-'}</td>
                  <td style={{color: 'var(--text-muted)'}}>{contact.occupation || '-'}</td>
                  <td><span className={getStatusBadgeClass(contact.status)}>{contact.status}</span></td>
                  <td style={{textAlign: 'right'}}>
                    <button 
                      onClick={() => handleEdit(contact)}
                      title="Editar contacto"
                      style={{background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', padding: '0.4rem 0.6rem', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', marginRight: '0.5rem'}}>
                      <Edit2 size={15} />
                    </button>
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      title="Eliminar contacto"
                      style={{background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '0.4rem 0.6rem', borderRadius: '6px', color: '#fda4af', cursor: 'pointer'}}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ContactModal 
          contactToEdit={selectedContact}
          onClose={() => setIsModalOpen(false)} 
          onSave={() => {
            setIsModalOpen(false);
            fetchContacts();
          }} 
        />
      )}
    </div>
  );
};

export default Directory;
