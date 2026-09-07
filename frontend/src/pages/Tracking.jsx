import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, GitCommit, ArrowRight, Clock, Star } from 'lucide-react';
import TrackingModal from '../components/TrackingModal';

const STAGES = [
  { id: 'Contacto Inicial', title: 'Contacto Inicial', badgeClass: 'badge-inicial' },
  { id: 'Presentación Realizada', title: 'Presentación Realizada', badgeClass: 'badge-presentacion' },
  { id: 'En Negociación', title: 'En Negociación', badgeClass: 'badge-negociacion' },
  { id: 'Cierre Exitoso', title: 'Cierre Exitoso', badgeClass: 'badge-cierre' }
];

const Tracking = () => {
  const [followups, setFollowups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      const res = await api.get('/followups');
      setFollowups(res.data);
    } catch (error) {
      console.error('Error fetching followups:', error);
    }
  };

  const handleAdvanceStage = async (id, currentStage) => {
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1].id;
      try {
        await api.put(`/followups/${id}`, { stage: nextStage });
        fetchFollowups();
      } catch (error) {
        console.error('Error updating stage:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return '#f43f5e';
      case 'Media': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pipeline de Seguimiento Crystone</h1>
          <p className="page-subtitle">Monitoreo activo del progreso de clientes y prospectos</p>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nuevo Seguimiento
        </button>
      </div>

      <div className="pipeline-grid">
        {STAGES.map(stage => {
          const items = followups.filter(f => f.stage === stage.id);
          return (
            <div key={stage.id} className="pipeline-col">
              <div className="pipeline-header">
                <span>{stage.title}</span>
                <span className={`badge ${stage.badgeClass}`}>{items.length}</span>
              </div>

              {items.length === 0 ? (
                <div style={{padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                  Sin prospectos en esta etapa
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="pipeline-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <h4 style={{fontWeight: 700, fontSize: '1rem', color: 'white'}}>{item.contactName}</h4>
                      <span style={{fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: getPriorityColor(item.priority), fontWeight: 700}}>
                        <Star size={12} style={{display: 'inline', marginRight: '3px'}} />{item.priority}
                      </span>
                    </div>

                    {item.notes && (
                      <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>
                        {item.notes}
                      </p>
                    )}

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-dim)'}}>
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <Clock size={14} /> {item.nextActionDate || 'Sin fecha'}
                      </span>

                      {stage.id !== 'Cierre Exitoso' && (
                        <button 
                          onClick={() => handleAdvanceStage(item.id, item.stage)}
                          style={{background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', fontWeight: 600}}>
                          Avanzar <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <TrackingModal 
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            fetchFollowups();
          }}
        />
      )}
    </div>
  );
};

export default Tracking;
