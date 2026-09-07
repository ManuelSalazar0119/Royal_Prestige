import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';
import ContactModal from '../components/ContactModal';

const Directory = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/contacts');
      setContacts(res.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
        <h1 className="page-title">Directorio de Contactos</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nuevo Contacto
        </button>
      </div>

      <div style={{marginBottom: '1.5rem', position: 'relative', maxWidth: '400px'}}>
        <div style={{position: 'absolute', top: '10px', left: '12px', color: 'var(--text-muted)'}}>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre o teléfono..." 
          className="input-control" 
          style={{paddingLeft: '2.5rem'}}
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
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No se encontraron contactos</td></tr>
            ) : (
              filteredContacts.map(contact => (
                <tr key={contact.id}>
                  <td style={{color: 'var(--text-muted)'}}>#{contact.id.toString().padStart(4, '0')}</td>
                  <td style={{fontWeight: 500}}>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.relationship}</td>
                  <td>{contact.occupation}</td>
                  <td><span className={getStatusBadgeClass(contact.status)}>{contact.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ContactModal 
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
