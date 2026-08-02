import React, { useState } from 'react';
import { TrendingUp, Users, UserPlus, DollarSign } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import AddLeadModal from '../components/AddLeadModal';

const Dashboard = () => {
  const { leads } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeProspects = leads.filter(l => l.status === 'Contacted' || l.status === 'Qualified').length;
  const closedWon = leads.filter(l => l.status === 'Closed').length;

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening with your leads today.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex-center" style={{ gap: '8px' }}>
          <UserPlus size={18} /> Add New Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <StatCard title="Total Leads" value={leads.length} trend="+12%" trendUp icon={<Users size={24} color="var(--accent-primary)" />} />
        <StatCard title="Active Prospects" value={activeProspects} trend="+5%" trendUp icon={<TrendingUp size={24} color="var(--warning)" />} />
        <StatCard title="Closed Won" value={closedWon} trend="-2%" trendUp={false} icon={<DollarSign size={24} color="var(--success)" />} />
        <StatCard title="Conversion Rate" value={`${leads.length > 0 ? ((closedWon / leads.length) * 100).toFixed(1) : 0}%`} trend="+4.3%" trendUp icon={<PieChartIcon />} />
      </div>

      {/* Recent Activity / Mini Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Recent Leads</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '500' }}>Name</th>
                <th style={{ padding: '12px 16px', fontWeight: '500' }}>Company</th>
                <th style={{ padding: '12px 16px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '500' }}>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map(lead => (
                <TableRow 
                  key={lead.id} 
                  name={lead.name} 
                  company={lead.company} 
                  status={lead.status} 
                  date={new Date(lead.date).toLocaleDateString()} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon }) => (
  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div className="flex-between">
      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
      <div style={{ 
        padding: '10px', 
        borderRadius: 'var(--radius-md)', 
        backgroundColor: 'rgba(255, 255, 255, 0.05)' 
      }}>
        {icon}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
      <h3 style={{ fontSize: '2rem', fontWeight: '700' }}>{value}</h3>
      <span style={{ 
        color: trendUp ? 'var(--success)' : 'var(--danger)', 
        fontSize: '0.875rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        background: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)'
      }}>
        {trend}
      </span>
    </div>
  </div>
);

const TableRow = ({ name, company, status, date }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' };
      case 'Contacted': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
      case 'Qualified': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' };
      case 'Closed': return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: 'white' };
    }
  };

  const statusStyle = getStatusColor(status);

  return (
    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
      <td style={{ padding: '16px', fontWeight: '500' }}>{name}</td>
      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{company}</td>
      <td style={{ padding: '16px' }}>
        <span style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          {status}
        </span>
      </td>
      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{date}</td>
    </tr>
  );
};

const PieChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

export default Dashboard;
