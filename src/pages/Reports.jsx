import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Target, 
  Users, 
  BarChart3, 
  Calendar, 
  Download, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Reports = () => {
  const { leads } = useLeads();
  const [dateRange, setDateRange] = useState('month');

  const safeLeads = Array.isArray(leads) ? leads : [];
  const totalLeadsCount = safeLeads.length || 28;
  const wonLeadsCount = safeLeads.filter(l => l.status === 'Won').length || 11;
  const winRate = '39.2%';
  const totalWonRevenue = '₹39.4 Lakh';
  const activePipelineValue = '₹48.5 Lakh';

  // Export CSV handler
  const handleExport = () => {
    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Representative,Role,Assigned Leads,Won Deals,Pipeline Value,Won Revenue,Win Rate,Quota Progress\n';
    salesRepsData.forEach(r => {
      csv += `"${r.name}","${r.role}",${r.assigned},${r.won},"${r.pipeline}","${r.wonRevenue}","${r.rate}","${r.quota}%"\n`;
    });
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `Enterprise_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Apr 2026', leads: 18, won: 4, revenue: '₹14.5L', heightPct: 40 },
    { month: 'May 2026', leads: 24, won: 6, revenue: '₹21.0L', heightPct: 53 },
    { month: 'Jun 2026', leads: 29, won: 8, revenue: '₹28.5L', heightPct: 64 },
    { month: 'Jul 2026', leads: 35, won: 10, revenue: '₹34.0L', heightPct: 77 },
    { month: 'Aug 2026', leads: 41, won: 12, revenue: '₹42.0L', heightPct: 91 },
    { month: 'Sep 2026', leads: 45, won: 14, revenue: '₹48.5L', heightPct: 100 }
  ];

  // Conversion funnel stages
  const funnelStages = [
    { stage: '1. Inbound Leads Captured', count: 45, pct: '100%', color: '#2563eb', dropoff: '-' },
    { stage: '2. First Contact Made', count: 38, pct: '84.4%', color: '#3b82f6', dropoff: '-15.6%' },
    { stage: '3. Formally Qualified Requirement', count: 28, pct: '62.2%', color: '#059669', dropoff: '-22.2%' },
    { stage: '4. Commercial Proposal Submitted', count: 20, pct: '44.4%', color: '#7c3aed', dropoff: '-17.8%' },
    { stage: '5. Contract & Credit Terms Negotiation', count: 14, pct: '31.1%', color: '#ea580c', dropoff: '-13.3%' },
    { stage: '6. Closed Won Contracts', count: 11, pct: '24.4%', color: '#16a34a', dropoff: '-6.7%' }
  ];

  // Sales team performance leaderboard
  const salesRepsData = [
    {
      name: 'Ajay Bhor',
      role: 'Sales Manager',
      territory: 'West India & Maharashtra',
      assigned: 28,
      won: 11,
      pipeline: '₹42.5 Lakh',
      wonRevenue: '₹18.2 Lakh',
      rate: '39.2%',
      avgDeal: '₹1.65 Lakh',
      quota: 114,
      avgVelocity: '6.8 Days'
    },
    {
      name: 'Sarah Smith',
      role: 'Key Account Executive',
      territory: 'North India & Delhi NCR',
      assigned: 22,
      won: 7,
      pipeline: '₹31.0 Lakh',
      wonRevenue: '₹9.8 Lakh',
      rate: '31.8%',
      avgDeal: '₹1.40 Lakh',
      quota: 98,
      avgVelocity: '7.4 Days'
    },
    {
      name: 'Suresh Patil',
      role: 'Commercial Lead',
      territory: 'Gujarat & Western Ports',
      assigned: 19,
      won: 5,
      pipeline: '₹26.4 Lakh',
      wonRevenue: '₹6.5 Lakh',
      rate: '26.3%',
      avgDeal: '₹1.30 Lakh',
      quota: 86,
      avgVelocity: '8.1 Days'
    },
    {
      name: 'Priya Sharma',
      role: 'Corporate Sales Rep',
      territory: 'South India & Bangalore',
      assigned: 15,
      won: 4,
      pipeline: '₹18.0 Lakh',
      wonRevenue: '₹4.9 Lakh',
      rate: '26.6%',
      avgDeal: '₹1.22 Lakh',
      quota: 82,
      avgVelocity: '7.9 Days'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
      {/* 1. LARGE PAGE HEADER */}
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
              Enterprise Sales Reports
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
              EXECUTIVE INTELLIGENCE
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.96rem', marginTop: '4px' }}>
            High-level revenue projections, stage drop-off analysis, and sales representative quota tracking.
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}>
            <Calendar size={16} color="#64748b" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month (Sep 2026)</option>
              <option value="quarter">This Quarter (Q3)</option>
              <option value="year">Full Year (2026)</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="btn-primary"
            style={{ padding: '11px 22px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}
          >
            <Download size={18} />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SUMMARY METRIC ROW (4 LARGE CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Overall Win Rate
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Target size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#16a34a', lineHeight: 1.1 }}>
            {winRate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <ArrowUpRight size={15} />
            <span>+4.2% vs previous quarter</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Won Revenue
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
            {totalWonRevenue}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
            <span>Across 27 finalized enterprise contracts</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Pipeline Value
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#7c3aed', lineHeight: 1.1 }}>
            {activePipelineValue}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
            <span>In-flight active opportunities</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Avg Time to Win
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
            7 Days 4 Hours
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <span>⚡ 3.2 days faster than benchmark</span>
          </div>
        </div>
      </div>

      {/* 3. LARGE CHART 1: Lead Generation Trend & Revenue Projections (Large Width) */}
      <div className="card" style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Lead Generation & Closed Deal Velocity
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              Monthly comparison of total prospects discovered vs finalized closed deals and contract pipeline.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2563eb' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#475569' }}>Total Leads Discovered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#16a34a' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#475569' }}>Deals Closed Won</span>
            </div>
          </div>
        </div>

        {/* Big visual bar chart area with comfortable height and readable labels */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px',
          height: '300px',
          padding: '24px 20px 10px 20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          {monthlyTrend.map((item, idx) => (
            <div
              key={item.month}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                flex: 1,
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              {/* Value Pills above bars */}
              <div style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#2563eb',
                backgroundColor: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #bfdbfe',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                {item.leads} Leads
              </div>

              {/* Dual Bars container */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%', width: '60px' }}>
                {/* Leads Bar */}
                <div
                  style={{
                    flex: 1,
                    height: `${item.heightPct}%`,
                    backgroundColor: '#2563eb',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.2)'
                  }}
                  title={`${item.leads} leads generated`}
                />
                {/* Won Deals Bar */}
                <div
                  style={{
                    flex: 1,
                    height: `${(item.won / 14) * 85}%`,
                    backgroundColor: '#16a34a',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 6px rgba(22,163,74,0.2)'
                  }}
                  title={`${item.won} deals won`}
                />
              </div>

              {/* Month Label */}
              <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#1e293b' }}>
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LARGE CHART 2: Conversion Funnel & Stage Drop-off (Large Width) */}
      <div className="card" style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Stage-by-Stage Conversion Funnel
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              Full lifecycle progression from captured inbound prospect through qualification, quotation, and contract signing.
            </p>
          </div>

          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: '700',
            color: '#15803d'
          }}>
            Overall Funnel Throughput: 24.4%
          </div>
        </div>

        {/* Large Horizontal Funnel Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {funnelStages.map((stg) => (
            <div
              key={stg.stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '14px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* Stage Name */}
              <div style={{ width: '280px', minWidth: '280px', fontSize: '0.94rem', fontWeight: '700', color: '#0f172a' }}>
                {stg.stage}
              </div>

              {/* Visual Progress Bar */}
              <div style={{ flex: 1, backgroundColor: '#e2e8f0', height: '28px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  width: stg.pct,
                  height: '100%',
                  backgroundColor: stg.color,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '12px',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  transition: 'width 0.5s ease',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)'
                }}>
                  {stg.count} Deals
                </div>
              </div>

              {/* Conversion Percentage */}
              <div style={{ width: '70px', textAlign: 'right', fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                {stg.pct}
              </div>

              {/* Drop-off metric */}
              <div style={{
                width: '90px',
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: stg.dropoff === '-' ? '#64748b' : '#dc2626',
                backgroundColor: stg.dropoff === '-' ? '#ffffff' : '#fef2f2',
                padding: '4px 8px',
                borderRadius: '6px',
                border: `1px solid ${stg.dropoff === '-' ? '#cbd5e1' : '#fca5a5'}`
              }}>
                {stg.dropoff === '-' ? 'Top Funnel' : `${stg.dropoff} drop`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. THEN: PERFORMANCE TABLE (Large Sales Team Leaderboard) */}
      <div className="card" style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Sales Team Performance Leaderboard
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              Comprehensive representative audits, won revenues, win rates, and target quota attainment.
            </p>
          </div>

          <span style={{
            fontSize: '0.82rem',
            fontWeight: '700',
            color: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid #86efac'
          }}>
            Team Average Quota Met: 95.0%
          </span>
        </div>

        {/* Large Table with Comfortable Row Heights */}
        <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <table className="crm-table">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem' }}>Executive Name</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem' }}>Territory / Focus</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem', textAlign: 'center' }}>Assigned</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem', textAlign: 'center' }}>Won Deals</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem' }}>Pipeline Value</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem' }}>Won Revenue</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem', textAlign: 'center' }}>Win Rate</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem' }}>Avg Velocity</th>
                <th style={{ padding: '16px 20px', fontSize: '0.84rem', width: '180px' }}>Quota Progress</th>
              </tr>
            </thead>
            <tbody>
              {salesRepsData.map(rep => (
                <tr key={rep.name} style={{ height: '70px' }}>
                  {/* Name with Avatar */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.9rem'
                      }}>
                        {rep.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.98rem' }}>{rep.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{rep.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Territory */}
                  <td style={{ padding: '16px 20px', fontSize: '0.88rem', color: '#475569' }}>
                    {rep.territory}
                  </td>

                  {/* Assigned */}
                  <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', color: '#0f172a', fontSize: '0.94rem' }}>
                    {rep.assigned}
                  </td>

                  {/* Won Deals */}
                  <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800', color: '#16a34a', fontSize: '1rem' }}>
                    {rep.won}
                  </td>

                  {/* Pipeline Value */}
                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#7c3aed', fontSize: '0.95rem' }}>
                    {rep.pipeline}
                  </td>

                  {/* Won Revenue */}
                  <td style={{ padding: '16px 20px', fontWeight: '800', color: '#059669', fontSize: '1.05rem' }}>
                    {rep.wonRevenue}
                  </td>

                  {/* Win Rate */}
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span style={{
                      fontWeight: '800',
                      fontSize: '0.86rem',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#f0fdf4',
                      color: '#16a34a',
                      border: '1px solid #86efac'
                    }}>
                      {rep.rate}
                    </span>
                  </td>

                  {/* Velocity */}
                  <td style={{ padding: '16px 20px', fontSize: '0.86rem', color: '#475569', fontWeight: '600' }}>
                    {rep.avgVelocity}
                  </td>

                  {/* Quota Progress */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(rep.quota, 100)}%`,
                          height: '100%',
                          backgroundColor: rep.quota >= 100 ? '#16a34a' : '#2563eb',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.84rem', fontWeight: '800', color: rep.quota >= 100 ? '#16a34a' : '#0f172a' }}>
                        {rep.quota}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
