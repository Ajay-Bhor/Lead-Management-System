import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    passwordHash: '',
    role: 'Sales Executive'
  });

  if (!isOpen) return null;

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
      backgroundColor: 'rgba(15, 17, 21, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '32px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)'
        }}>
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Add New Team Member</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="Jane Doe" />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input required name="username" value={formData.username} onChange={handleChange} style={inputStyle} placeholder="janedoe" />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input required type="password" name="passwordHash" value={formData.passwordHash} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
          </div>

          <div>
            <label style={labelStyle}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
              <option value="Admin">Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Executive">Sales Executive</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create User</button>
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

export default AddUserModal;
