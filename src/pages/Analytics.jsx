import React from 'react';
import { PieChart, TrendingUp, DollarSign, Users, Award, Target, ArrowUpRight } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Analytics = () => {
  const { leads } = useLeads();

  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const lostLeads = leads.filter(l => l.status === 'Lost').length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Analytics & Insights</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Performance metrics, lead conversion rates, and channel effectiveness.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <MetricCard title="Conversion Rate" value={`${conversionRate}%`} subtitle="Lead to Customer conversion" icon={<Award color="var(--accent-primary)" size={24} />} />
        <MetricCard title="Qualified Leads" value={qualifiedLeads} subtitle="High potential prospects" icon={<Target color="var(--success)" size={24} />} />
        <MetricCard title="Deals Closed (Won)" value={wonLeads} subtitle="Successfully converted" icon={<DollarSign color="#10b981" size={24} />} />
        <MetricCard title="Lost Opportunities" value={lostLeads} subtitle="Disqualified or churned" icon={<TrendingUp color="var(--danger)" size={24} style={{ transform: 'rotate(180deg)' }} />} />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Pipeline Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Pipeline Status Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'].map(status => {
              const count = statusCounts[status] || 0;
              const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0;
              return (
                <div key={status}>
                  <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{status}</span>
                    <span style={{ fontWeight: '600' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: getStatusColor(status),
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Lead Acquisition by Source</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Website forms', 'Social media', 'Email campaigns', 'Phone calls', 'Manual entry'].map(source => {
              const count = sourceCounts[source] || 0;
              const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0;
              return (
                <div key={source}>
                  <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{source}</span>
                    <span style={{ fontWeight: '600' }}>{count} leads</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: 'var(--accent-primary)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon }) => (
  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div className="flex-between">
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</span>
      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return '#3b82f6';
    case 'Contacted': return '#f59e0b';
    case 'Qualified': return '#10b981';
    case 'Proposal Sent': return '#8b5cf6';
    case 'Won': return '#059669';
    case 'Lost': return '#ef4444';
    default: return '#6b7280';
  }
};

export default Analytics;
