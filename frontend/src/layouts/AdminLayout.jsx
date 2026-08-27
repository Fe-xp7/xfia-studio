import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, Bell, Building2, CreditCard, FileStack, LayoutDashboard, LogOut, Menu, Search, Settings, Users, X, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useSettings } from '../contexts/SettingsContext.jsx';
const items = [
  ['/', 'Dashboard', LayoutDashboard], ['/empresas', 'Empresas', Building2], ['/sites', 'Sites', FileStack], ['/templates', 'Templates', Zap], ['/clientes', 'Clientes', Users], ['/mensalidades', 'Mensalidades', CreditCard], ['/configuracoes', 'Configurações', Settings],
];
export function AdminLayout() {
  const [open, setOpen] = useState(false); const { admin, logout } = useAuth();const{settings}=useSettings();const{pathname}=useLocation();const editor=/^\/sites\/[^/]+$/.test(pathname);
  return <div className={`app-shell ${editor?'app-shell--editor':''}`}>
    {open && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setOpen(false)}/>}
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="brand">{settings.logoUrl?<img className="brand-logo" src={settings.logoUrl} alt=""/>:<span className="brand-mark"><Zap size={19}/></span>}<div><strong>{settings.systemName}</strong><small>Operação interna</small></div><button className="icon-button mobile-only" onClick={() => setOpen(false)}><X/></button></div>
      <nav>{items.map(([to,label,Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}><Icon size={19}/>{label}</NavLink>)}</nav>
      <div className="sidebar-user"><span className="avatar">{admin?.name?.[0]}</span><div><strong>{admin?.name}</strong><small>{admin?.email}</small></div><button className="icon-button" title="Sair" onClick={logout}><LogOut size={18}/></button></div>
    </aside>
    <main className="main"><header className="mobile-header"><button className="icon-button" onClick={() => setOpen(true)}><Menu/></button><strong>{settings.systemName}</strong></header>{!editor&&<header className="desktop-topbar"><label><Search/><input placeholder="Buscar no painel..."/><kbd>⌘ K</kbd></label><div><button className="topbar-icon"><Bell/><i/></button><span className="pulse-orb"><Activity/></span></div></header>}<Outlet/></main>
  </div>;
}
