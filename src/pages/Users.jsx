import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Users = () => {
  const adminUsers = [
    { id: '1', name: 'Ajay Bhor', email: 'ajay@example.com', role: 'Admin' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Sales Manager' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Sales Executive' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage access and roles for your sales team.</p>
        </div>
        <button className="btn-primary flex-center" style={{ gap: '8px' }}>
          Add New User
        </button>
      </div>

      <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <ShieldAlert size={20} />
        <span>This is an Admin-only view. Only users with the <strong>Admin</strong> role can modify other users.</span>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '16px', fontWeight: '500' }}>Name</th>
              <th style={{ padding: '16px', fontWeight: '500' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: '500' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: user.role === 'Admin' ? 'var(--danger)' : 'var(--accent-primary)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
