import React from 'react';
import { ChevronRight, Building, Check, X, User } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const STAGES = [
  { key: 'New', label: 'New Lead', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.08)' },
  { key: 'Contacted', label: 'Contacted', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
  { key: 'Qualified', label: 'Qualified', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
  { key: 'Proposal Sent', label: 'Proposal Sent', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)' },
  { key: 'Won', label: 'Won Deal', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
  { key: 'Lost', label: 'Lost Lead', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.08)' }
];

const PipelineBoard = ({ filteredLeads }) => {
  const { updateLeadStatus, openLeadDetail } = useLeads();
  const safeLeads = Array.isArray(filteredLeads) ? filteredLeads : [];

  const getNextStage = (currentStage) => {
    const order = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won'];
    const idx = order.indexOf(currentStage);
    if (idx !== -1 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return null;
  };

  const formatCurrency = (val) => {
    if (!val || val === 0) return '₹0';
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  const getPriorityPill = (priority, score) => {
    if (priority === 'Hot' || score >= 75) {
      return { bg: 'var(--danger-bg)', color: 'var(--danger)', text: 'Hot' };
    }
    if (priority === 'Warm' || score >= 50) {
      return { bg: 'var(--warning-bg)', color: 'var(--warning)', text: 'Warm' };
    }
    return { bg: 'var(--bg-tertiary)', color: 'var(--text-muted)', text: 'Cold' };
  };

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      overflowX: 'auto',
      paddingBottom: '16px',
      flex: 1,
      minHeight: '580px'
    }}>
      {STAGES.map(stage => {
        const stageLeads = safeLeads.filter(l => l.status === stage.key);
        const stageTotalValue = stageLeads.reduce((acc, curr) => acc + Number(curr.dealValue || 0), 0);

        return (
          <div
            key={stage.key}
            style={{
              width: '295px',
              minWidth: '295px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '12px'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              padding: '4px 6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: stage.color,
                  boxShadow: `0 0 8px ${stage.color}88`
                }}></span>
                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {stage.label}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)'
                }}>
                  {stageLeads.length}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: stage.color }}>
                {formatCurrency(stageTotalValue)}
              </span>
            </div>

            {/* Cards Container */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1,
              overflowY: 'auto'
            }}>
              {stageLeads.length === 0 ? (
                <div style={{
                  padding: '36px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  border: '1px dashed var(--border-light)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  No deals in {stage.label}
                </div>
              ) : (
                stageLeads.map(lead => {
                  const priority = getPriorityPill(lead.priority, lead.score);
                  const nextStage = getNextStage(lead.status);

                  return (
                    <div
                      key={lead.id}
                      className="glass-panel card-hover-lift"
                      onClick={() => openLeadDetail(lead)}
                      style={{
                        padding: '14px',
                        backgroundColor: 'var(--bg-secondary)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Top stage accent line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: stage.color
                      }}></div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', paddingTop: '2px' }}>
                        <h4 style={{
                          fontSize: '0.94rem',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          lineHeight: 1.3
                        }}>
                          {lead.name}
                        </h4>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: priority.bg,
                          color: priority.color,
                          whiteSpace: 'nowrap'
                        }}>
                          {priority.text}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                        <Building size={13} color="var(--text-muted)" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                          {lead.company || 'Individual Prospect'}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border-light)',
                        fontSize: '0.82rem'
                      }}>
                        <span style={{ fontWeight: '800', color: 'var(--success)' }}>
                          ₹{Number(lead.dealValue || 0).toLocaleString('en-IN')}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                            {lead.assignedTo?.split(' ')[0] || 'Rep'}
                          </span>

                          {lead.status !== 'Won' && lead.status !== 'Lost' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {nextStage && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateLeadStatus(lead.id, nextStage);
                                  }}
                                  title={`Advance to ${nextStage}`}
                                  style={{
                                    padding: '3px 7px',
                                    borderRadius: '5px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--accent-primary)',
                                    border: '1px solid var(--border-light)',
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                  }}
                                >
                                  <span>Next</span>
                                  <ChevronRight size={12} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateLeadStatus(lead.id, 'Won');
                                }}
                                title="Mark Won"
                                style={{
                                  padding: '4px 6px',
                                  borderRadius: '5px',
                                  backgroundColor: 'var(--success-bg)',
                                  color: 'var(--success)',
                                  border: '1px solid rgba(16, 185, 129, 0.25)',
                                  fontSize: '0.72rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateLeadStatus(lead.id, 'Lost');
                                }}
                                title="Mark Lost"
                                style={{
                                  padding: '4px 6px',
                                  borderRadius: '5px',
                                  backgroundColor: 'var(--danger-bg)',
                                  color: 'var(--danger)',
                                  border: '1px solid rgba(244, 63, 94, 0.25)',
                                  fontSize: '0.72rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>
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
  );
};

export default PipelineBoard;
