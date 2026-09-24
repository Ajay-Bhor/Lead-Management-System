import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Shield, 
  Briefcase, 
  Users as UsersIcon, 
  UserCheck, 
  CheckCircle2,
  Lock,
  Mail
} from 'lucide-react';
import AddUserModal from '../components/AddUserModal';
import { useLeads } from '../context/LeadContext';

const API_URL = 'http://localhost:8080/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All');
  const { isAuthenticated, isAdmin, currentUser } = useLeads();

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
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (userData) => {
    if (!isAdmin) {
      alert('Access Denied: Only System Administrators can create users.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers(prev => [...prev, newUser]);
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Error: User creation is restricted to Administrators.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!isAdmin) {
      alert('Access Denied: Only System Administrators can delete users.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert('Error: Only administrators can delete users.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];

  // Categorize by roles
  const admins = safeUsers.filter(u => u.role === 'Admin');
  const salesManagers = safeUsers.filter(u => u.role === 'Sales Manager');
  const salesExecutives = safeUsers.filter(u => u.role === 'Sales Executive');

  const filteredUsers = safeUsers.filter(u => {
    if (roleFilter === 'All') return true;
    return u.role === roleFilter;
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin':
        return {
          bg: 'var(--danger-bg)',
          color: 'var(--danger)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          icon: <Shield size={13} />,
          gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
        };
      case 'Sales Manager':
        return {
          bg: 'var(--purple-bg)',
          color: 'var(--purple)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          icon: <Briefcase size={13} />,
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        };
      case 'Sales Executive':
        return {
          bg: 'var(--info-bg)',
          color: 'var(--accent-primary)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          icon: <UserCheck size={13} />,
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };
      default:
        return {
          bg: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-light)',
          icon: <UsersIcon size={13} />,
          gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
        };
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '36px' }}>
      {/* Header bar */}
      <div className="flex-between" style={{ marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              User & Team Management
            </h1>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--accent-primary)'
            }}>
              {safeUsers.length} members
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configure sales team hierarchy, role-based access control, and user credentials.
          </p>
        </div>

        {isAdmin ? (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ fontSize: '0.84rem' }}>
            <UserPlus size={16} />
            <span>Add Member</span>
          </button>
        ) : (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#64748b',
            fontSize: '0.82rem',
            fontWeight: '600'
          }}>
            <Lock size={14} color="#64748b" />
            <span>Admin-Only Provisioning</span>
          </div>
        )}
      </div>

      {/* Non-Admin Security Notice */}
      {!isAdmin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          color: '#1e40af',
          fontSize: '0.875rem'
        }}>
          <ShieldAlert size={18} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <strong>Read-Only Member Directory:</strong> User provisioning, account creation, and member removal are strictly restricted to <strong>System Administrators</strong>. You are currently viewing as <strong>{currentUser?.role || 'Team Member'}</strong> ({currentUser?.name || currentUser?.username}).
          </div>
        </div>
      )}

      {/* Role Summary KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        {/* 1. Admin Card */}
        <div 
          onClick={() => setRoleFilter('Admin')}
          className="glass-panel card-hover-lift" 
          style={{ 
            padding: '18px 20px', 
            cursor: 'pointer',
            border: roleFilter === 'Admin' ? '2px solid var(--danger)' : '1px solid var(--border-light)'
          }}
        >
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Admin</span>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-bg)' }}>
              <Shield size={16} color="var(--danger)" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '2px' }}>
            {admins.length}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--danger)', fontWeight: '600' }}>
            Full system control & security
          </span>
        </div>

        {/* 2. Sales Manager Card */}
        <div 
          onClick={() => setRoleFilter('Sales Manager')}
          className="glass-panel card-hover-lift" 
          style={{ 
            padding: '18px 20px', 
            cursor: 'pointer',
            border: roleFilter === 'Sales Manager' ? '2px solid var(--purple)' : '1px solid var(--border-light)'
          }}
        >
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Sales Manager</span>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--purple-bg)' }}>
              <Briefcase size={16} color="var(--purple)" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '2px' }}>
            {salesManagers.length}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--purple)', fontWeight: '600' }}>
            Pipeline & territory supervision
          </span>
        </div>

        {/* 3. Sales Executive Card */}
        <div 
          onClick={() => setRoleFilter('Sales Executive')}
          className="glass-panel card-hover-lift" 
          style={{ 
            padding: '18px 20px', 
            cursor: 'pointer',
            border: roleFilter === 'Sales Executive' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)'
          }}
        >
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Sales Executive</span>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
              <UserCheck size={16} color="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '2px' }}>
            {salesExecutives.length}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
            Direct lead capture & outreach
          </span>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="glass-panel" style={{
        padding: '10px 16px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginRight: '4px' }}>Filter by Role:</span>
        {['All', 'Admin', 'Sales Manager', 'Sales Executive'].map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: roleFilter === role ? 'var(--accent-primary)' : 'var(--border-light)',
              backgroundColor: roleFilter === role ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: roleFilter === role ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            {role === 'All' ? 'All Roles' : role}
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-light)', fontSize: '0.82rem', backgroundColor: 'var(--bg-tertiary)' }}>
              <th style={{ padding: '14px 20px', fontWeight: '700' }}>Team Member</th>
              <th style={{ padding: '14px 20px', fontWeight: '700' }}>Username</th>
              <th style={{ padding: '14px 20px', fontWeight: '700' }}>Role Assignment</th>
              <th style={{ padding: '14px 20px', fontWeight: '700' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No team members found under {roleFilter}.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const badge = getRoleBadgeStyle(user.role);
                const initials = getInitials(user.name || user.username);

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: badge.gradient,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            {user.name || user.username}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            {user.role === 'Admin' ? 'System Administrator' : user.role === 'Sales Manager' ? 'Regional Supervision' : 'Sales Representative'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.86rem', fontWeight: '500' }}>
                      @{user.username}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: badge.border,
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}>
                        {badge.icon}
                        <span>{user.role}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--success)',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                        <span>Active</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {isAdmin && user.username !== 'admin' ? (
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          title="Delete user"
                          style={{ 
                            padding: '7px', 
                            color: 'var(--danger)', 
                            borderRadius: 'var(--radius-sm)', 
                            display: 'inline-flex',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }} 
                          className="hover-bg-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span 
                          title={!isAdmin ? "Only Admin can delete users" : "System Administrator (Protected)"} 
                          style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Lock size={14} />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddUser={handleAddUser} />
    </div>
  );
};

export default Users;
