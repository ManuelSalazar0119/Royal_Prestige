import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, GitCommit, Settings, Gem } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">
           <Gem size={22} />
        </div>
        <span className="brand-title">Crystone</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>
        <NavLink to="/directory" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <Users size={19} />
          Directorio
        </NavLink>
        <NavLink to="/appointments" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <CalendarDays size={19} />
          Citas y Entrevistas
        </NavLink>
        <NavLink to="/tracking" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <GitCommit size={19} />
          Seguimiento
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <Settings size={19} />
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
