import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, UserPlus, Trash2, Edit2 } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import AddLeadModal from '../components/AddLeadModal';

const Leads = () => {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'All' || lead.source === filterSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>All Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track your entire lead pipeline.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex-center" style={{ gap: '8px' }}>
          <UserPlus size={18} /> Add New Lead
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search leads by name or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Sources</option>
            <option value="Website forms">Website forms</option>
            <option value="Social media">Social media</option>
            <option value="Email campaigns">Email campaigns</option>
            <option value="Phone calls">Phone calls</option>
            <option value="Manual entry">Manual entry</option>
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '16px', fontWeight: '500' }}>Name & Email</th>
              <th style={{ padding: '16px', fontWeight: '500' }}>Company & Phone</th>
              <th style={{ padding: '16px', fontWeight: '500' }}>Source</th>
              <th style={{ padding: '16px', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <LeadRow 
                  key={lead.id} 
                  lead={lead} 
                  onUpdateStatus={updateLeadStatus}
                  onDelete={deleteLead}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const LeadRow = ({ lead, onUpdateStatus, onDelete }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' };
      case 'Contacted': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
      case 'Qualified': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' };
      case 'Proposal Sent': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }; // Purple
      case 'Won': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }; // Solid Green
      case 'Lost': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }; // Red
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: 'white' };
    }
  };

  const statusStyle = getStatusColor(lead.status);

  return (
    <tr style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }}>
      <td style={{ padding: '16px' }}>
        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{lead.name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.email}</div>
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{lead.company}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.phone}</div>
      </td>
      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
        {lead.source}
      </td>
      <td style={{ padding: '16px' }}>
        <select 
          value={lead.status}
          onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none'
          }}
        >
          <option value="New" style={{ color: '#000' }}>New</option>
          <option value="Contacted" style={{ color: '#000' }}>Contacted</option>
          <option value="Qualified" style={{ color: '#000' }}>Qualified</option>
          <option value="Proposal Sent" style={{ color: '#000' }}>Proposal Sent</option>
          <option value="Won" style={{ color: '#000' }}>Won</option>
          <option value="Lost" style={{ color: '#000' }}>Lost</option>
        </select>
      </td>
      <td style={{ padding: '16px', textAlign: 'right' }}>
        <button onClick={() => onDelete(lead.id)} style={{ padding: '8px', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', border: '1px solid transparent' }} className="hover-bg-danger">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default Leads;
