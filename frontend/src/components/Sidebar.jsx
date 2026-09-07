import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{width: 32, height: 32, backgroundColor: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
           <Users size={20} />
        </div>
        Manager Pro
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/directory" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <Users size={20} />
          Directorio
        </NavLink>
        <NavLink to="/appointments" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <CalendarDays size={20} />
          Gestor de Citas
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <Settings size={20} />
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
