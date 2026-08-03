import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserPlus, Trash2 } from 'lucide-react';
import AddUserModal from '../components/AddUserModal';
import { useLeads } from '../context/LeadContext';

const API_URL = 'http://localhost:8080/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useLeads();

  useEffect(() => {
    fetchUsers();
  }, [isAuthenticated]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers(prev => [...prev, newUser]);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage access and roles for your sales team.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex-center" style={{ gap: '8px' }}>
          <UserPlus size={18} /> Add New User
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
              <th style={{ padding: '16px', fontWeight: '500' }}>Username</th>
              <th style={{ padding: '16px', fontWeight: '500' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No team members found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{user.name || user.username}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>@{user.username}</td>
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
                    {user.username !== 'admin' && (
                      <button onClick={() => handleDeleteUser(user.id)} style={{ padding: '8px', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', border: '1px solid transparent' }} className="hover-bg-danger">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddUser={handleAddUser} />
    </div>
  );
};

export default Users;
