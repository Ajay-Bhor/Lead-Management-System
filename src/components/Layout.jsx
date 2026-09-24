import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Kanban,
  CheckSquare, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  Search, 
  Sun, 
  Moon, 
  Sparkles,
  Command,
  Zap,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationsPopover from './NotificationsPopover';
import { useLeads } from '../context/LeadContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const { leads, simulateLeadCapture, currentUser, logout } = useLeads();
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    await simulateLeadCapture();
    setIsSimulating(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const leadCount = Array.isArray(leads) ? leads.length : 0;
  const userName = currentUser?.name || 'Ajay Bhor';
  const userRole = currentUser?.role || 'Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AB';

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Dark Navy Sidebar */}
      <aside style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '22px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
          }}>
            LMS
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '1.12rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Urja LMS
              </h2>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                color: '#60a5fa',
                letterSpacing: '0.04em'
              }}>
                ENTERPRISE
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '500' }}>
              Sales Intelligence Suite
            </span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={{ padding: '18px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 10px 10px 10px'
          }}>
            Navigation
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              to="/" 
              active={location.pathname === '/'} 
            />
            <NavItem 
              icon={<Users size={18} />} 
              label="Leads" 
              to="/leads" 
              active={location.pathname === '/leads' || location.pathname.startsWith('/leads/')} 
              badge={leadCount > 0 ? leadCount : undefined}
            />
            <NavItem 
              icon={<Kanban size={18} />} 
              label="Pipeline" 
              to="/pipeline" 
              active={location.pathname === '/pipeline'} 
            />
            <NavItem 
              icon={<CheckSquare size={18} />} 
              label="Tasks" 
              to="/tasks" 
              active={location.pathname === '/tasks'} 
            />
            <NavItem 
              icon={<Calendar size={18} />} 
              label="Calendar" 
              to="/calendar" 
              active={location.pathname === '/calendar'} 
            />
            <NavItem 
              icon={<BarChart3 size={18} />} 
              label="Reports" 
              to="/reports" 
              active={location.pathname === '/reports' || location.pathname === '/analytics'} 
            />
            <NavItem 
              icon={<ShieldCheck size={18} />} 
              label="Users" 
              to="/users" 
              active={location.pathname === '/users'} 
            />
            <NavItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              to="/settings" 
              active={location.pathname === '/settings'} 
            />
          </ul>
        </nav>

        {/* System Status / Online Pill */}
        <div style={{
          padding: '14px 16px',
          margin: '12px',
          borderRadius: '10px',
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
              }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f8fafc' }}>
                Server Online
              </span>
            </div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399'
            }}>
              Port 8080
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Connected to SQLite Lead Engine
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px',
          padding: '0 28px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20
        }}>
          {/* Global Search Bar */}
          <div style={{ position: 'relative', width: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search leads, companies, phone, email..." 
              style={{
                width: '100%',
                padding: '9px 64px 9px 38px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
                fontSize: '0.86rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.boxShadow = 'none';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/leads?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
            <div style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '2px 5px',
              fontSize: '0.65rem',
              color: '#64748b',
              fontWeight: '600'
            }}>
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
          
          {/* Right Action Icons & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Simulate Lead */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="btn-secondary"
              title="Generate a realistic incoming inquiry"
              style={{ fontSize: '0.8rem', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={14} color="#d97706" />
              <span>{isSimulating ? 'Capturing...' : 'Simulate Lead'}</span>
            </button>

            {/* Notifications Popover */}
            <NotificationsPopover />

            <div style={{ height: '24px', width: '1px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

            {/* User Profile Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 6px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.82rem'
              }}>
                {initials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>
                  {userName}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600' }}>
                  {userRole}
                </span>
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              title="Logout from CRM"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.borderColor = '#fca5a5';
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content with Generous Enterprise Spacing */}
        <div style={{ padding: '32px 40px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, to, badge }) => (
  <li>
    <Link 
      to={to} 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '8px',
        color: active ? '#ffffff' : '#94a3b8',
        backgroundColor: active ? '#2563eb' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
        fontWeight: active ? '600' : '500',
        fontSize: '0.88rem'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#1e293b';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: active ? '#ffffff' : '#94a3b8', display: 'flex' }}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span style={{
          fontSize: '0.68rem',
          fontWeight: '700',
          padding: '2px 6px',
          borderRadius: '9999px',
          backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : '#334155',
          color: '#ffffff'
        }}>
          {badge}
        </span>
      )}
    </Link>
  </li>
);

export default Layout;
