import React from 'react';
import { TrendingUp, DollarSign, Award, Target, Users, PhoneCall, CheckCircle2, BarChart3, PieChart, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useTasks } from '../context/TaskContext';

const STAGE_WEIGHTS = {
  'New': 0.10,            // 10% probability
  'Contacted': 0.25,      // 25% probability
  'Qualified': 0.50,      // 50% probability
  'Proposal Sent': 0.70,  // 70% probability
  'Negotiation': 0.85,    // 85% probability
  'Won': 1.00,            // 100% probability
  'Lost': 0.00            // 0% probability
};

const Analytics = () => {
  const { leads } = useLeads();
  const { tasks } = useTasks();

  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const totalLeads = safeLeads.length;
  const wonLeads = safeLeads.filter(l => l.status === 'Won');
  const lostLeads = safeLeads.filter(l => l.status === 'Lost');
  const qualifiedLeads = safeLeads.filter(l => l.status === 'Qualified');
  const negotiationLeads = safeLeads.filter(l => l.status === 'Negotiation');

  // Revenue Calculations
  const totalPipelineValue = safeLeads.reduce((acc, curr) => acc + Number(curr.dealValue || 0), 0);
  const wonRevenue = wonLeads.reduce((acc, curr) => acc + Number(curr.dealValue || 0), 0);
  
  // Weighted Forecast: Value * Stage Probability
  const weightedForecast = safeLeads.reduce((acc, curr) => {
    const weight = STAGE_WEIGHTS[curr.status] ?? 0.2;
    return acc + (Number(curr.dealValue || 0) * weight);
  }, 0);

  const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : '0.0';

  // Sales Rep Performance Aggregates
  const salesReps = ['Ajay Bhor', 'Sarah Smith'];
  const repPerformance = salesReps.map(repName => {
    const repLeads = safeLeads.filter(l => l.assignedTo === repName);
    const repWon = repLeads.filter(l => l.status === 'Won');
    const repValue = repLeads.reduce((acc, l) => acc + Number(l.dealValue || 0), 0);
    const repWonValue = repWon.reduce((acc, l) => acc + Number(l.dealValue || 0), 0);
    const repWinRate = repLeads.length > 0 ? ((repWon.length / repLeads.length) * 100).toFixed(1) : '0.0';
    return {
      name: repName,
      totalLeads: repLeads.length,
      wonDeals: repWon.length,
      pipelineValue: repValue,
      wonRevenue: repWonValue,
      winRate: repWinRate
    };
  });

  // Productivity
  const completedTasks = safeTasks.filter(t => t.isCompleted).length;
  const pendingTasks = safeTasks.filter(t => !t.isCompleted).length;

  // Source Counts
  const sourceCounts = safeLeads.reduce((acc, lead) => {
    if (lead?.source) {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
    }
    return acc;
  }, {});

  const formatLakhs = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>
      <div className="flex-between" style={{ marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Executive Reports & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Revenue forecast, sales rep leaderboard, lead conversion rates, and team productivity.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <MetricCard
          title="Weighted Revenue Forecast"
          value={formatLakhs(weightedForecast)}
          subtitle="Probability-adjusted expected yield"
          icon={<DollarSign color="#16a34a" size={22} />}
          iconBg="rgba(22, 163, 74, 0.1)"
        />
        <MetricCard
          title="Total Pipeline Valuation"
          value={formatLakhs(totalPipelineValue)}
          subtitle="Cumulative contract estimates"
          icon={<BarChart3 color="var(--accent-primary)" size={22} />}
          iconBg="rgba(37, 99, 235, 0.1)"
        />
        <MetricCard
          title="Closed-Won Revenue"
          value={formatLakhs(wonRevenue)}
          subtitle={`${wonLeads.length} deals closed successfully`}
          icon={<Award color="var(--warning)" size={22} />}
          iconBg="rgba(217, 119, 6, 0.1)"
        />
        <MetricCard
          title="Overall Conversion Rate"
          value={`${conversionRate}%`}
          subtitle={`${wonLeads.length} Won / ${totalLeads} Total Leads`}
          icon={<Target color="#7c3aed" size={22} />}
          iconBg="rgba(124, 58, 237, 0.1)"
        />
      </div>

      {/* Sales Representative Performance Leaderboard */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div className="flex-between" style={{ marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Sales Representative Performance</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Lead allocation, closed revenue, and individual win rates</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
            Round-Robin Balanced
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-light)', fontSize: '0.84rem' }}>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Representative</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Assigned Leads</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Deals Won</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Win Rate</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Active Pipeline</th>
                <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Won Revenue</th>
              </tr>
            </thead>
            <tbody>
              {repPerformance.map(rep => (
                <tr key={rep.name} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {rep.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{rep.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 18px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    {rep.totalLeads} leads
                  </td>
                  <td style={{ padding: '16px 18px', color: 'var(--success)', fontWeight: '700' }}>
                    {rep.wonDeals} deals
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <span style={{
                      backgroundColor: Number(rep.winRate) > 20 ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg-tertiary)',
                      color: Number(rep.winRate) > 20 ? 'var(--success)' : 'var(--text-secondary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                      fontSize: '0.82rem'
                    }}>
                      {rep.winRate}%
                    </span>
                  </td>
                  <td style={{ padding: '16px 18px', color: 'var(--text-primary)', fontWeight: '600' }}>
                    {formatLakhs(rep.pipelineValue)}
                  </td>
                  <td style={{ padding: '16px 18px', textAlign: 'right', fontWeight: '700', color: 'var(--success)', fontSize: '0.95rem' }}>
                    {formatLakhs(rep.wonRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline Funnel & Stage Drop-off */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Stage Funnel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '4px' }}>7-Stage Sales Pipeline Funnel</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Count, stage probability, and probability-weighted pipeline yield
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { stage: 'New', color: '#2563eb' },
              { stage: 'Contacted', color: '#d97706' },
              { stage: 'Qualified', color: '#16a34a' },
              { stage: 'Proposal Sent', color: '#7c3aed' },
              { stage: 'Negotiation', color: '#ea580c' },
              { stage: 'Won', color: '#059669' },
              { stage: 'Lost', color: '#dc2626' }
            ].map(({ stage, color }) => {
              const stageLeads = safeLeads.filter(l => l.status === stage);
              const count = stageLeads.length;
              const stageVal = stageLeads.reduce((acc, curr) => acc + Number(curr.dealValue || 0), 0);
              const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0;
              const prob = (STAGE_WEIGHTS[stage] * 100).toFixed(0);

              return (
                <div key={stage}>
                  <div className="flex-between" style={{ fontSize: '0.86rem', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{stage}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>({prob}% probability)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{count} leads</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formatLakhs(stageVal)}</span>
                    </div>
                  </div>
                  <div style={{ height: '7px', width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: color,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Productivity & Source Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Productivity */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '4px' }}>Sales Team Productivity</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Action items and customer engagements</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
                <CheckCircle2 size={24} color="var(--success)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{completedTasks}</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tasks Completed</span>
              </div>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
                <PhoneCall size={24} color="var(--warning)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{pendingTasks}</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending Follow-ups</span>
              </div>
            </div>
          </div>

          {/* Lead Capture by Source */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '4px' }}>Lead Capture Channels</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Volume generated per acquisition channel</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Website forms', 'Social media', 'Email campaigns', 'Phone calls', 'Manual entry'].map(source => {
                const count = sourceCounts[source] || 0;
                const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0;
                return (
                  <div key={source}>
                    <div className="flex-between" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{source}</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{count} leads ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
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
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon, iconBg }) => (
  <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div className="flex-between">
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500' }}>{title}</span>
      <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: iconBg, display: 'flex' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '1.85rem', fontWeight: '700', lineHeight: 1, color: 'var(--text-primary)' }}>{value}</div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{subtitle}</div>
  </div>
);

export default Analytics;
