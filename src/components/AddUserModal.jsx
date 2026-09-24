import React, { useState } from 'react';
import { X, ShieldCheck, User, Mail, Lock, Briefcase } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const { isAdmin } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    passwordHash: '',
    role: 'Sales Executive'
  });

  if (!isOpen || !isAdmin) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(formData);
    setFormData({ name: '', username: '', passwordHash: '', role: 'Sales Executive' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '32px',
        position: 'relative',
        backgroundColor: '#ffffff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '16px',
        border: '1px solid rgba(226, 232, 240, 0.9)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#e11d48',
          fontSize: '0.74rem',
          fontWeight: '700',
          marginBottom: '10px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <ShieldCheck size={14} />
          <span>Admin Authorization Active</span>
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
          Provision New User Account
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '22px' }}>
          Assign system permissions, territory credentials, and organizational role.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                required 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                style={{ ...inputStyle, paddingLeft: '36px' }} 
                placeholder="e.g. Jane Doe" 
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Username / Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                required 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                style={{ ...inputStyle, paddingLeft: '36px' }} 
                placeholder="janedoe or jane@urjafoods.com" 
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Initial Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                required 
                type="password" 
                name="passwordHash" 
                value={formData.passwordHash} 
                onChange={handleChange} 
                style={{ ...inputStyle, paddingLeft: '36px' }} 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Role Assignment *</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                style={{ ...inputStyle, paddingLeft: '36px' }}
              >
                <option value="Sales Executive">Sales Executive (Standard CRM Access)</option>
                <option value="Sales Manager">Sales Manager (Team & Pipeline Supervision)</option>
                <option value="Admin">Admin (Full System & User Governance)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '9px 18px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '9px 20px' }}>
              Create User Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: '#475569',
  fontSize: '0.82rem',
  fontWeight: '600'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  color: '#0f172a',
  outline: 'none',
  fontSize: '0.9rem',
  transition: 'border-color 0.15s ease'
};

export default AddUserModal;
