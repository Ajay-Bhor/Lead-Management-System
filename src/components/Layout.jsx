import React from 'react';
import { Home, Users, Settings, PieChart, Bell, Search, CheckSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 className="text-gradient">LeadGen Pro</h2>
        </div>
        
        <nav style={{ padding: '16px 0', flex: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            <NavItem icon={<Home size={20} />} label="Dashboard" to="/" active={location.pathname === '/'} />
            <NavItem icon={<Users size={20} />} label="All Leads" to="/leads" active={location.pathname === '/leads'} />
            <NavItem icon={<CheckSquare size={20} />} label="Tasks" to="/tasks" active={location.pathname === '/tasks'} />
            <NavItem icon={<PieChart size={20} />} label="Analytics" to="/analytics" active={location.pathname === '/analytics'} />
            <NavItem icon={<Settings size={20} />} label="Team Access" to="/users" active={location.pathname === '/users'} />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
        {/* Top Navbar */}
        <header className="flex-between" style={{
          padding: '16px 32px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
          
          <div className="flex-center" style={{ gap: '20px' }}>
            <button style={{ color: 'var(--text-secondary)' }}><Bell size={20} /></button>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), #a5b4fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              AB
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, to }) => (
  <li style={{ padding: '8px 24px' }}>
    <Link to={to} className="flex-center" style={{
      justifyContent: 'flex-start',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.2s',
      border: active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
    }}>
      <span style={{ color: active ? 'var(--accent-primary)' : 'inherit' }}>{icon}</span>
      <span style={{ fontWeight: active ? '600' : '500' }}>{label}</span>
    </Link>
  </li>
);

export default Layout;
