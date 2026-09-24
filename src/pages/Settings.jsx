import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  Building, 
  Mail, 
  Phone, 
  Key, 
  Save, 
  Upload
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Settings = () => {
  const { currentUser, setCurrentUser } = useLeads();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Ajay Bhor',
    email: currentUser?.email || 'admin@urjafoods.com',
    phone: currentUser?.phone || '+91 98220 12345',
    role: currentUser?.role || 'Admin',
    department: 'Enterprise Sales & Operations'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    inboundLeads: true,
    overdueTasks: true,
    dealWonAlerts: true,
    dailySummary: false
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    localStorage.setItem('user_profile', JSON.stringify(updated));
    setProfileSuccess('Profile details updated successfully.');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!passwordData.newPassword || passwordData.newPassword.length < 5) {
      setPasswordError('New password must be at least 5 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password changed successfully.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          Profile & System Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
          Manage your personal credentials, contact info, security parameters, and notification alerts.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="#2563eb" />
          Personal Profile & Contact
        </h3>

        {profileSuccess && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '18px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {profileSuccess}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Avatar display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: '800'
            }}>
              {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <button
                type="button"
                onClick={() => alert("Upload avatar simulation")}
                className="btn-secondary"
                style={{ padding: '7px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={14} />
                <span>Upload Photo</span>
              </button>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>PNG, JPG up to 2MB</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input
                required
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Email Address *</label>
              <input
                required
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Role Designation</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  disabled
                  value={profileData.role}
                  className="form-input"
                  style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', fontWeight: '700', color: '#2563eb' }}>
                  MANAGED BY ADMIN
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} color="#2563eb" />
          Change Password
        </h3>

        {passwordError && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '18px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '18px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label className="form-label">Current Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">New Password</label>
              <input
                required
                type="password"
                placeholder="Min 5 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                required
                type="password"
                placeholder="Re-enter password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="#2563eb" />
          Notification Preferences
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { id: 'inboundLeads', title: 'New Inbound Lead Assigned', desc: 'Notify immediately when an inquiry is round-robin allocated to your queue.' },
            { id: 'overdueTasks', title: 'Overdue Follow-up Alerts', desc: 'Send daily morning reminders for tasks that have passed their due date.' },
            { id: 'dealWonAlerts', title: 'Stage Moved to Won Celebrations', desc: 'Broadcast celebratory channel notifications when team members close high-value contracts.' },
            { id: 'dailySummary', title: 'Daily Executive Digest Email', desc: 'Receive a 7:00 PM email summary of pipeline activities and tomorrow’s agenda.' }
          ].map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.id]}
                onChange={() => toggleNotification(item.id)}
                style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
