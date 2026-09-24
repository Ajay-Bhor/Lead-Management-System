import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  Calendar, 
  User, 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Clock, 
  Layers,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

// Exactly 7 stages as specified by user:
// NEW | CONTACTED | QUALIFIED | PROPOSAL | NEGOTIATION | WON | LOST
const PIPELINE_STAGES = [
  { key: 'New', label: 'NEW', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { key: 'Contacted', label: 'CONTACTED', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { key: 'Qualified', label: 'QUALIFIED', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { key: 'Proposal', label: 'PROPOSAL', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', aliases: ['Proposal', 'Proposal Sent'] },
  { key: 'Negotiation', label: 'NEGOTIATION', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  { key: 'Won', label: 'WON', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
  { key: 'Lost', label: 'LOST', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' }
];

const Pipeline = () => {
  const navigate = useNavigate();
  const { leads, updateLeadStatus } = useLeads();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRep, setSelectedRep] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const safeLeads = Array.isArray(leads) ? leads : [];

  // Filter leads based on search, rep, and priority
  const filteredLeads = useMemo(() => {
    return safeLeads.filter(lead => {
      const term = searchTerm.toLowerCase().trim();
      if (term) {
        const matches = (lead?.name || '').toLowerCase().includes(term) ||
                        (lead?.company || '').toLowerCase().includes(term);
        if (!matches) return false;
      }
      if (selectedRep !== 'All' && lead.assignedTo !== selectedRep) {
        return false;
      }
      if (selectedPriority !== 'All' && (lead.priority || 'Normal') !== selectedPriority) {
        return false;
      }
      return true;
    });
  }, [safeLeads, searchTerm, selectedRep, selectedPriority]);

  // Aggregate metrics
  const activePipelineValue = useMemo(() => {
    return safeLeads
      .filter(l => l.status !== 'Won' && l.status !== 'Lost')
      .reduce((sum, l) => sum + Number(l.dealValue || l.expectedValue || 0), 0);
  }, [safeLeads]);

  const totalWonValue = useMemo(() => {
    return safeLeads
      .filter(l => l.status === 'Won')
      .reduce((sum, l) => sum + Number(l.dealValue || l.expectedValue || 0), 0);
  }, [safeLeads]);

  const formatCurrency = (val) => {
    if (!val || val === 0) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
      case 'Hot':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
      case 'Medium':
      case 'Warm':
        return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      default:
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
    }
  };

  // Helper to advance stage
  const advanceStage = (leadId, currentStatus) => {
    const stageKeys = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
    let normalized = currentStatus === 'Proposal Sent' ? 'Proposal' : currentStatus;
    const currentIdx = stageKeys.indexOf(normalized);
    if (currentIdx !== -1 && currentIdx < stageKeys.length - 1) {
      const nextStage = stageKeys[currentIdx + 1];
      updateLeadStatus(leadId, nextStage);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* 1. LARGE PAGE HEADER & PIPELINE SUMMARY */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Sales Pipeline Kanban
            </h1>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe'
            }}>
              7-STAGE VELOCITY
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.96rem', marginTop: '4px' }}>
            Spacious enterprise pipeline board tracking active opportunities across all conversion stages.
          </p>
        </div>

        {/* Pipeline Summary Metrics & Add Lead */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#ffffff',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Active Pipeline</span>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2563eb' }}>{formatCurrency(activePipelineValue)}</div>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0' }} />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Won Revenue</span>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#16a34a' }}>{formatCurrency(totalWonValue)}</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/leads/new')}
            className="btn-primary"
            style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}
          >
            <UserPlus size={18} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px 22px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '280px', maxWidth: '440px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search deals by lead name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#0f172a' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '600' }}>Assigned Rep:</span>
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">All Representatives</option>
              <option value="Ajay Bhor">Ajay Bhor</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Suresh Patil">Suresh Patil</option>
              <option value="Priya Sharma">Priya Sharma</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '600' }}>Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {(searchTerm || selectedRep !== 'All' || selectedPriority !== 'All') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedRep('All'); setSelectedPriority('All'); }}
              style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. WIDE HORIZONTAL KANBAN BOARD */}
      {/* Generous column width: 340px-360px per stage with smooth horizontal scrolling */}
      <div style={{
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '24px',
        minHeight: '680px',
        alignItems: 'flex-start'
      }}>
        {PIPELINE_STAGES.map(stage => {
          // Match leads for this column
          const stageLeads = filteredLeads.filter(l => {
            if (stage.aliases) {
              return stage.aliases.includes(l.status);
            }
            return l.status === stage.key;
          });

          const stageTotalValue = stageLeads.reduce((acc, curr) => acc + Number(curr.dealValue || curr.expectedValue || 0), 0);

          return (
            <div
              key={stage.key}
              style={{
                width: '350px',
                minWidth: '350px',
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '16px'
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '14px',
                marginBottom: '14px',
                borderBottom: `2px solid ${stage.color}25`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: stage.color,
                    boxShadow: `0 0 8px ${stage.color}88`
                  }} />
                  <span style={{
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    letterSpacing: '0.04em',
                    color: '#0f172a'
                  }}>
                    {stage.label}
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: stage.bg,
                    color: stage.color,
                    border: `1px solid ${stage.border}`
                  }}>
                    {stageLeads.length}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  color: stage.color
                }}>
                  {formatCurrency(stageTotalValue)}
                </span>
              </div>

              {/* Lead Cards in Stage */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                flex: 1,
                overflowY: 'auto'
              }}>
                {stageLeads.length === 0 ? (
                  <div style={{
                    padding: '48px 16px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.86rem',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff'
                  }}>
                    No deals in {stage.label}
                  </div>
                ) : (
                  stageLeads.map(lead => {
                    const pStyle = getPriorityStyle(lead.priority);
                    const canAdvance = stage.key !== 'Won' && stage.key !== 'Lost';

                    return (
                      <div
                        key={lead.id}
                        className="card"
                        style={{
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        {/* Top row: Priority & Expected Value */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: pStyle.bg,
                            color: pStyle.color,
                            border: `1px solid ${pStyle.border}`
                          }}>
                            {lead.priority || 'Normal'} Priority
                          </span>

                          <span style={{
                            fontSize: '1rem',
                            fontWeight: '800',
                            color: '#059669'
                          }}>
                            {formatCurrency(lead.dealValue || lead.expectedValue || 450000)}
                          </span>
                        </div>

                        {/* Lead Name (clickable) */}
                        <div>
                          <Link
                            to={`/leads/${lead.id}`}
                            style={{
                              textDecoration: 'none',
                              color: '#0f172a',
                              fontSize: '1.02rem',
                              fontWeight: '800',
                              lineHeight: 1.3,
                              display: 'block'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#0f172a'}
                          >
                            {lead.name}
                          </Link>

                          {/* Company */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#64748b',
                            fontSize: '0.84rem',
                            marginTop: '4px'
                          }}>
                            <Building size={14} color="#94a3b8" />
                            <span>{lead.company || 'Sahyadri Agro Ltd'}</span>
                          </div>
                        </div>

                        {/* Metadata row: Assigned Salesperson & Follow-up date */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '10px',
                          borderTop: '1px solid #f1f5f9',
                          fontSize: '0.78rem',
                          color: '#475569'
                        }}>
                          {/* Salesperson */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#2563eb',
                              color: '#ffffff',
                              fontSize: '0.68rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {(lead.assignedTo || 'AB').substring(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '600' }}>{lead.assignedTo || 'Ajay Bhor'}</span>
                          </div>

                          {/* Follow-up Date */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                            <Calendar size={13} color="#94a3b8" />
                            <span>{lead.followUpDate || '26 Sep 2026'}</span>
                          </div>
                        </div>

                        {/* Quick Action Footer: Move forward or View details */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                          <button
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#2563eb',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              padding: '2px 0'
                            }}
                          >
                            View Journey →
                          </button>

                          {canAdvance && (
                            <button
                              onClick={() => advanceStage(lead.id, lead.status)}
                              title="Advance to next pipeline stage"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.borderColor = '#2563eb';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                                e.currentTarget.style.color = '#1e293b';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                              }}
                            >
                              <span>Next Stage</span>
                              <ChevronRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
