import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const AddLeadModal = ({ isOpen, onClose }) => {
  const { addLead } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: 'Website forms'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addLead(formData);
    setFormData({ name: '', email: '', phone: '', company: '', status: 'New', source: 'Website forms' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 17, 21, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '32px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)'
        }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Add New Lead</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="John Doe" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Company</label>
              <input required name="company" value={formData.company} onChange={handleChange} style={inputStyle} placeholder="Acme Corp" />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="john@example.com" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="(555) 000-0000" />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Source</label>
              <select name="source" value={formData.source} onChange={handleChange} style={inputStyle}>
                <option value="Website forms">Website forms</option>
                <option value="Social media">Social media</option>
                <option value="Email campaigns">Email campaigns</option>
                <option value="Phone calls">Phone calls</option>
                <option value="Manual entry">Manual entry</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: 'var(--text-secondary)',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-tertiary)',
  color: 'var(--text-primary)',
  outline: 'none',
  fontSize: '0.95rem'
};

export default AddLeadModal;
