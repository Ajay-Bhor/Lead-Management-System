import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, MapPin, Building, Calendar, Award, UserCheck, PhoneCall, Users, FileText, Send, Clock, CheckCircle2, ArrowRight, Edit2 } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const LeadDetailDrawer = () => {
  const { selectedLead, isDrawerOpen, closeLeadDetail, updateLeadStatus, reassignLead, fetchActivities, addActivity, openEditLead } = useLeads();
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline'); // timeline, log
  const [logType, setLogType] = useState('Call'); // Call, Meeting, Email, Note
  const [logForm, setLogForm] = useState({ title: '', description: '', outcome: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedLead?.id) {
      loadActivities(selectedLead.id);
    }
  }, [selectedLead?.id]);

  const loadActivities = async (leadId) => {
    const data = await fetchActivities(leadId);
    setActivities(Array.isArray(data) ? data : []);
  };

  if (!isDrawerOpen || !selectedLead) return null;

  const handleStageChange = async (e) => {
    await updateLeadStatus(selectedLead.id, e.target.value);
    loadActivities(selectedLead.id);
  };

  const handleAssigneeChange = async (e) => {
    await reassignLead(selectedLead.id, e.target.value);
    loadActivities(selectedLead.id);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.title.trim()) return;

    setIsSubmitting(true);
    await addActivity(selectedLead.id, {
      type: logType,
      title: logForm.title.trim(),
      description: logForm.description.trim(),
      outcome: logForm.outcome.trim() || undefined
    });

    setLogForm({ title: '', description: '', outcome: '' });
    setIsSubmitting(false);
    setActiveTab('timeline');
    loadActivities(selectedLead.id);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', text: 'Hot' };
    if (score >= 50) return { color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', text: 'Warm' };
    return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', text: 'Cold' };
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return <PhoneCall size={16} color="var(--warning)" />;
      case 'Meeting': return <Users size={16} color="var(--accent-primary)" />;
      case 'Email': return <Mail size={16} color="#7c3aed" />;
      case 'StatusChange': return <ArrowRight size={16} color="var(--success)" />;
      default: return <FileText size={16} color="var(--text-secondary)" />;
    }
  };

  const scoreMeta = getScoreColor(selectedLead.score || 50);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--modal-overlay)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1050
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '540px',
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0',
        overflow: 'hidden'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-tertiary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                backgroundColor: scoreMeta.bg,
                color: scoreMeta.color,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: '700'
              }}>
                {scoreMeta.text} ({selectedLead.score || 50}/100)
              </span>
              <span style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--accent-primary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: '600',
                border: '1px solid var(--border-light)'
              }}>
                {selectedLead.source}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {selectedLead.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={14} />
              <span>{selectedLead.company || 'Individual Prospect'}</span>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => openEditLead(selectedLead)}
              title="Edit / Update Lead Details"
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: '600'
              }}
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={closeLeadDetail}
              style={{
                padding: '6px',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick KPI Strip inside Drawer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '16px 24px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Estimated Value</span>
            <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--success)' }}>
              ₹{Number(selectedLead.dealValue || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Pipeline Stage</span>
            <select
              value={selectedLead.status}
              onChange={handleStageChange}
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--accent-primary)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none',
                width: '100%'
              }}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Assigned Rep</span>
            <select
              value={selectedLead.assignedTo || 'Ajay Bhor'}
              onChange={handleAssigneeChange}
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none',
                width: '100%'
              }}
            >
              <option value="Ajay Bhor">Ajay Bhor</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Vikram Joshi">Vikram Joshi</option>
              <option value="Pooja Kulkarni">Pooja Kulkarni</option>
              <option value="Auto Round-Robin">Auto Round-Robin</option>
            </select>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Contact Details Card */}
          <div className="glass-panel" style={{ padding: '16px 18px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Contact & Territory
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="var(--text-muted)" />
                <a href={`mailto:${selectedLead.email}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  {selectedLead.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-primary)' }}>{selectedLead.phone || 'No phone'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-primary)' }}>{selectedLead.territory || 'Maharashtra'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={15} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)' }}>
                  {selectedLead.date ? new Date(selectedLead.date).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>
            {selectedLead.notes && (
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <strong>Notes:</strong> {selectedLead.notes}
              </div>
            )}
          </div>

          {/* Quick Action Logger Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => { setLogType('Call'); setActiveTab('log'); }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeTab === 'log' && logType === 'Call' ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-tertiary)',
                color: activeTab === 'log' && logType === 'Call' ? 'var(--warning)' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <PhoneCall size={14} /> Log Call
            </button>
            <button
              onClick={() => { setLogType('Meeting'); setActiveTab('log'); }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeTab === 'log' && logType === 'Meeting' ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-tertiary)',
                color: activeTab === 'log' && logType === 'Meeting' ? 'var(--accent-primary)' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} /> Log Meeting
            </button>
            <button
              onClick={() => { setLogType('Email'); setActiveTab('log'); }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeTab === 'log' && logType === 'Email' ? 'rgba(124, 58, 237, 0.15)' : 'var(--bg-tertiary)',
                color: activeTab === 'log' && logType === 'Email' ? '#7c3aed' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Mail size={14} /> Log Email
            </button>
            <button
              onClick={() => { setLogType('Note'); setActiveTab('log'); }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeTab === 'log' && logType === 'Note' ? 'rgba(100, 116, 139, 0.15)' : 'var(--bg-tertiary)',
                color: activeTab === 'log' && logType === 'Note' ? 'var(--text-primary)' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <FileText size={14} /> Add Note
            </button>
          </div>

          {/* Logging Form Modal Box */}
          {activeTab === 'log' && (
            <form onSubmit={handleLogSubmit} className="glass-panel animate-fade-in" style={{ padding: '16px 18px', marginBottom: '20px', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', fontSize: '0.88rem' }}>Record {logType} Activity</span>
                <button type="button" onClick={() => setActiveTab('timeline')} style={{ color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  required
                  placeholder={`Activity Title / Summary (e.g. Discussed pricing tiers)`}
                  value={logForm.title}
                  onChange={(e) => setLogForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <textarea
                  rows={2}
                  placeholder="Detailed notes or discussion points..."
                  value={logForm.description}
                  onChange={(e) => setLogForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
                <input
                  placeholder="Outcome / Next Steps (e.g. Follow-up meeting next Tuesday)"
                  value={logForm.outcome}
                  onChange={(e) => setLogForm(prev => ({ ...prev, outcome: e.target.value }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setActiveTab('timeline')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                    Save Activity
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Communication History Timeline */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Communication History ({activities.length})</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>Chronological feed</span>
            </h4>

            {activities.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock size={28} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                <p style={{ fontSize: '0.85rem' }}>No activity logged yet.</p>
                <span style={{ fontSize: '0.75rem' }}>Use the buttons above to log a call, meeting, or email.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map(item => (
                  <div key={item.id} className="glass-panel" style={{ padding: '14px 16px', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                      <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', display: 'flex' }}>
                        {getActivityIcon(item.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: '500' }}>
                          By {item.loggedBy || 'System'}
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    )}
                    {item.outcome && (
                      <div style={{
                        marginTop: '8px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-tertiary)',
                        fontSize: '0.78rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <CheckCircle2 size={13} color="var(--success)" />
                        <span><strong>Outcome:</strong> {item.outcome}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailDrawer;
