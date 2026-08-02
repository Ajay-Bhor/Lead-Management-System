import React, { useState } from 'react';
import { TrendingUp, Users, UserPlus, DollarSign, CheckCircle, Calendar, PhoneCall, ListTodo } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useTasks } from '../context/TaskContext';
import AddLeadModal from '../components/AddLeadModal';

const Dashboard = () => {
  const { leads } = useLeads();
  const { tasks, completeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeLeads = leads.filter(l => ['New', 'Contacted', 'Qualified', 'Proposal Sent'].includes(l.status)).length;
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const lostLeads = leads.filter(l => l.status === 'Lost').length;
  
  const pendingTasks = tasks.filter(t => !t.isCompleted);

  const getTaskIcon = (type) => {
    switch (type) {
      case 'Meeting': return <Calendar size={16} color="var(--accent-primary)" />;
      case 'Call': return <PhoneCall size={16} color="var(--warning)" />;
      case 'Follow-up': return <ListTodo size={16} color="var(--success)" />;
      default: return <ListTodo size={16} />;
    }
  };

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <StatCard title="Total Leads" value={leads.length} icon={<Users size={24} color="var(--accent-primary)" />} />
        <StatCard title="Active Leads" value={activeLeads} icon={<TrendingUp size={24} color="var(--warning)" />} />
        <StatCard title="Won Leads" value={wonLeads} icon={<DollarSign size={24} color="var(--success)" />} />
        <StatCard title="Lost Leads" value={lostLeads} icon={<TrendingUp size={24} color="var(--danger)" style={{ transform: 'rotate(180deg)'}} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Monthly Report / Leads Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Recent Lead Activity</h2>
            <a href="/leads" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>View All</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>Company</th>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map(lead => (
                  <TableRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Management Widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Upcoming Tasks</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            {pendingTasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You're all caught up!</p>
            ) : (
              pendingTasks.slice(0, 4).map(task => (
                <div key={task.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>{task.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => completeTask(task.id)} style={{ color: 'var(--text-muted)' }} className="hover-success">
                    <CheckCircle size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          <button className="btn-secondary" style={{ marginTop: '16px', width: '100%' }}>View All Tasks</button>
        </div>
      </div>
      
      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div className="flex-between">
      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
      <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        {icon}
      </div>
    </div>
    <h3 style={{ fontSize: '2rem', fontWeight: '700' }}>{value}</h3>
  </div>
);

const TableRow = ({ lead }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' };
      case 'Contacted': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
      case 'Qualified': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' };
      case 'Proposal Sent': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }; 
      case 'Won': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }; 
      case 'Lost': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }; 
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: 'white' };
    }
  };

  const statusStyle = getStatusColor(lead.status);

  return (
    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
      <td style={{ padding: '16px', fontWeight: '500' }}>{lead.name}</td>
      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{lead.company}</td>
      <td style={{ padding: '16px' }}>
        <span style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          {lead.status}
        </span>
      </td>
    </tr>
  );
};

export default Dashboard;
