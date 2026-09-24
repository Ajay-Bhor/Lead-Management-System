import React, { useState } from 'react';
import * as XLSX from 'xlsx';
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
  ChevronDown,
  FileSpreadsheet,
  FileText,
  X
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Reports = () => {
  const { leads, currentUser } = useLeads();
  const [dateRange, setDateRange] = useState('month');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState(null);

  const safeLeads = Array.isArray(leads) ? leads : [];
  const totalLeadsCount = safeLeads.length || 28;
  const wonLeadsCount = safeLeads.filter(l => l.status === 'Won').length || 11;
  const winRate = '39.2%';
  const totalWonRevenue = '₹39.4 Lakh';
  const activePipelineValue = '₹48.5 Lakh';



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

  // Helper for formatted timestamp
  const getFormattedTimestamp = () => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return {
      display: `${dateFormatted}, ${timeFormatted} IST`,
      fileDate: now.toISOString().slice(0, 10),
      fileTime: timeFormatted.replace(/:/g, '-').replace(/\s+/g, '_')
    };
  };

  // Export Excel (.xlsx) well-structured multi-sheet workbook handler
  const handleExportExcel = () => {
    const ts = getFormattedTimestamp();
    const horizonLabel = dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'Current Month (September 2026)' : dateRange === 'quarter' ? 'Current Quarter (Q3 2026)' : 'Annual Cycle (2026)';
    const preparedBy = `${currentUser?.name || 'Ajay Bhor'} (${currentUser?.role || 'System Administrator'})`;

    // 1. MASTER EXECUTIVE INTELLIGENCE SHEET (AOA Structured Layout)
    const masterAOA = [
      ['URJA FOODS & AGRO ENTERPRISES'],
      ['ENTERPRISE LEAD MANAGEMENT SYSTEM (LMS) - EXECUTIVE INTELLIGENCE REPORT'],
      ['CONFIDENTIAL & PROPRIETARY SALES AUDIT'],
      [],
      ['REPORT METADATA & PARAMETERS'],
      ['Report Generated At', ts.display],
      ['Report Scope / Horizon', horizonLabel],
      ['Authorized Officer', preparedBy],
      ['Total Active Leads Audited', totalLeadsCount],
      ['Active Pipeline Valuation', activePipelineValue],
      ['Realized Won Revenue', totalWonRevenue],
      ['Overall Organization Win Rate', winRate],
      [],
      ['========================================================================================================'],
      ['SECTION 1: KEY PERFORMANCE INDICATORS (KPIs)'],
      ['========================================================================================================'],
      ['KPI Metric Indicator', 'Consolidated Value', 'Target Benchmark', 'Health / Status Assessment'],
      ['Overall Win Rate', winRate, '35.0% Target', 'Exceeds Benchmark (+4.2%)'],
      ['Total Active Pipeline Value', activePipelineValue, '₹40.0 Lakh Target', 'Optimal Volume (+21.25%)'],
      ['Total Closed Won Revenue', totalWonRevenue, '₹35.0 Lakh Target', 'Above Quota (+12.57%)'],
      ['Closed Won Deal Count', `${wonLeadsCount} Closed Deals`, '10 Deals Target', 'Goal Surpassed (110%)'],
      ['Active Pipeline Deals', `${totalLeadsCount - wonLeadsCount} Deals in Flight`, '25 Deals Benchmark', 'Strong Pipeline'],
      ['Average Response Velocity', '1 Hour 15 Mins', '< 2 Hours SLA', 'SLA Compliant (Optimal)'],
      [],
      ['========================================================================================================'],
      ['SECTION 2: SALES TEAM PERFORMANCE LEADERBOARD'],
      ['========================================================================================================'],
      ['Representative', 'Role / Title', 'Assigned Territory', 'Leads Assigned', 'Won Deals', 'Pipeline Value', 'Won Revenue', 'Win Rate (%)', 'Avg Deal Size', 'Quota Progress (%)', 'Avg Velocity'],
      ...salesRepsData.map(r => [
        r.name,
        r.role,
        r.territory,
        r.assigned,
        r.won,
        r.pipeline,
        r.wonRevenue,
        r.rate,
        r.avgDeal,
        `${r.quota}%`,
        r.avgVelocity
      ]),
      [
        'TOTAL CONSOLIDATED TEAM',
        'Sales Department',
        'All India Jurisdictions',
        salesRepsData.reduce((acc, r) => acc + r.assigned, 0),
        salesRepsData.reduce((acc, r) => acc + r.won, 0),
        activePipelineValue,
        totalWonRevenue,
        winRate,
        '₹1.52 Lakh',
        '101.5% Avg',
        '7.4 Days'
      ],
      [],
      ['========================================================================================================'],
      ['SECTION 3: CONVERSION FUNNEL VELOCITY & DROP-OFF AUDIT'],
      ['========================================================================================================'],
      ['Funnel Stage Index & Description', 'Leads Reaching Stage', 'Cumulative Conversion Rate', 'Stage Drop-off Rate', 'Audit Status'],
      ...funnelStages.map(f => [
        f.stage,
        f.count,
        f.pct,
        f.dropoff,
        f.dropoff === '-' ? 'Benchmark' : 'Normal Drop-off'
      ]),
      [],
      ['========================================================================================================'],
      ['SECTION 4: MONTHLY REVENUE & CONVERSION TRAJECTORY'],
      ['========================================================================================================'],
      ['Fiscal Month', 'Inbound Leads Captured', 'Won Contracts Closed', 'Closed Revenue', 'Month Conversion %'],
      ...monthlyTrend.map(m => [
        m.month,
        m.leads,
        m.won,
        m.revenue,
        `${((m.won / m.leads) * 100).toFixed(1)}%`
      ]),
      [],
      ['========================================================================================================'],
      ['SECTION 5: LEAD ACQUISITION SOURCE PERFORMANCE'],
      ['========================================================================================================'],
      ['Channel Source', 'Leads Captured', 'Deals Won', 'Conversion Rate (%)', 'Realized Revenue', 'Channel Efficiency'],
      ['Direct Sales Outreach', 14, 5, '35.7%', '₹18.2 Lakh', 'High Value / Highest Return'],
      ['Website & Inbound Portal', 12, 3, '25.0%', '₹10.5 Lakh', 'Steady Organic Demand'],
      ['Channel Partner Network', 8, 2, '25.0%', '₹6.8 Lakh', 'Consistent Volume'],
      ['Food Expo & Tradeshow', 6, 1, '16.7%', '₹3.9 Lakh', 'Longer Sales Cycle'],
      ['TOTAL CHANNELS', 40, 11, '27.5%', '₹39.4 Lakh', 'Diversified Sourcing']
    ];

    // 2. LIVE LEADS REGISTRY SHEET
    const leadsRegistryAOA = [
      ['URJA FOODS - CURRENT LIVE LEADS & PIPELINE REGISTRY'],
      [`Report Generated At: ${ts.display} | Total Leads: ${safeLeads.length}`],
      [],
      ['S.No', 'Lead ID', 'Lead / Client Name', 'Company Name', 'Contact Phone', 'Email Address', 'Lead Source', 'Pipeline Status', 'Priority', 'Assigned Rep', 'Expected Value (₹)', 'Creation Date', 'Next Follow-up', 'Strategic Notes'],
      ...safeLeads.map((l, index) => [
        index + 1,
        l.id || `LMS-${1000 + index}`,
        l.name || '',
        l.company || '',
        l.phone || '',
        l.email || '',
        l.source || '',
        l.status || '',
        l.priority || 'Normal',
        l.assignedTo || 'Unassigned',
        l.dealValue || l.expectedValue || 0,
        l.createdDate || l.date || '',
        l.followUpDate || '',
        l.notes || ''
      ]),
      [
        'TOTALS',
        `${safeLeads.length} Leads`,
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        safeLeads.reduce((sum, l) => sum + (parseFloat(l.dealValue || l.expectedValue) || 0), 0),
        '-',
        '-',
        '-'
      ]
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    const wsMaster = XLSX.utils.aoa_to_sheet(masterAOA);
    wsMaster['!cols'] = [
      { wch: 38 }, { wch: 28 }, { wch: 28 }, { wch: 18 }, { wch: 16 }, { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 20 }, { wch: 18 }
    ];

    const wsRegistry = XLSX.utils.aoa_to_sheet(leadsRegistryAOA);
    wsRegistry['!cols'] = [
      { wch: 8 }, { wch: 16 }, { wch: 26 }, { wch: 26 }, { wch: 16 }, { wch: 26 }, { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 35 }
    ];

    XLSX.utils.book_append_sheet(wb, wsMaster, 'Executive Overview');
    XLSX.utils.book_append_sheet(wb, wsRegistry, 'Live Leads Registry');

    const fileName = `Urja_Foods_LMS_Executive_Sales_Report_${ts.fileDate}_${ts.fileTime}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setDownloadToast({
      format: 'Excel (.xlsx)',
      filename: fileName,
      time: ts.display
    });
    setTimeout(() => setDownloadToast(null), 6000);
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const ts = getFormattedTimestamp();
    const horizonLabel = dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'Current Month (September 2026)' : dateRange === 'quarter' ? 'Current Quarter (Q3 2026)' : 'Annual Cycle (2026)';
    const preparedBy = `${currentUser?.name || 'Ajay Bhor'} (${currentUser?.role || 'System Administrator'})`;

    let csv = '# ====================================================================\n';
    csv += '# URJA FOODS & AGRO ENTERPRISES - LEAD MANAGEMENT SYSTEM\n';
    csv += '# EXECUTIVE REVENUE & PIPELINE INTELLIGENCE REPORT\n';
    csv += `# GENERATED AT: ${ts.display}\n`;
    csv += `# GENERATED BY: ${preparedBy}\n`;
    csv += `# REPORTING HORIZON: ${horizonLabel}\n`;
    csv += `# TOTAL PIPELINE VALUE: ${activePipelineValue} | WON REVENUE: ${totalWonRevenue} | WIN RATE: ${winRate}\n`;
    csv += '# ====================================================================\n\n';

    csv += 'Representative,Role,Assigned Territory,Assigned Leads,Won Deals,Pipeline Value,Won Revenue,Win Rate,Avg Deal Size,Quota Progress,Avg Velocity\n';
    salesRepsData.forEach(r => {
      csv += `"${r.name}","${r.role}","${r.territory}",${r.assigned},${r.won},"${r.pipeline}","${r.wonRevenue}","${r.rate}","${r.avgDeal}","${r.quota}%","${r.avgVelocity}"\n`;
    });
    
    // Add total row
    csv += `"TOTAL CONSOLIDATED TEAM","Sales Dept","All Territories",${salesRepsData.reduce((acc, r) => acc + r.assigned, 0)},${salesRepsData.reduce((acc, r) => acc + r.won, 0)},"${activePipelineValue}","${totalWonRevenue}","${winRate}","₹1.52 Lakh","101.5%","7.4 Days"\n\n`;

    csv += '# SECTION: MONTHLY REVENUE TRAJECTORY\n';
    csv += 'Fiscal Month,Inbound Leads Captured,Won Contracts Closed,Cumulative Revenue\n';
    monthlyTrend.forEach(m => {
      csv += `"${m.month}",${m.leads},${m.won},"${m.revenue}"\n`;
    });
    csv += '\n';

    csv += '# SECTION: CONVERSION FUNNEL DROP-OFF AUDIT\n';
    csv += 'Funnel Stage,Lead Volume,Cumulative Conversion %,Drop-off Rate\n';
    funnelStages.forEach(f => {
      csv += `"${f.stage}",${f.count},"${f.pct}","${f.dropoff}"\n`;
    });

    const uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.href = uri;
    const fileName = `Urja_Foods_LMS_Executive_Sales_Report_${ts.fileDate}_${ts.fileTime}.csv`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast({
      format: 'CSV (.csv)',
      filename: fileName,
      time: ts.display
    });
    setTimeout(() => setDownloadToast(null), 6000);
  };

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

          {/* Dual Excel & CSV Export Button */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
            }}>
              <button
                type="button"
                onClick={handleExportExcel}
                className="btn-primary"
                style={{
                  padding: '11px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.92rem',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                }}
                title="Download full multi-sheet Excel (.xlsx) workbook"
              >
                <FileSpreadsheet size={18} />
                <span>Export Report (Excel)</span>
              </button>
              <button
                type="button"
                onClick={() => setExportMenuOpen(prev => !prev)}
                className="btn-primary"
                style={{
                  padding: '11px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: '1px solid rgba(255,255,255,0.25)',
                  cursor: 'pointer'
                }}
                title="Select Export Format (Excel / CSV)"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {exportMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100,
                  minWidth: '220px'
                }}
              >
                <button
                  type="button"
                  onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                    <FileSpreadsheet size={16} />
                  </div>
                  <div>
                    <div>Excel Workbook</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '400' }}>Multi-sheet .xlsx format</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { handleExportCSV(); setExportMenuOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                    <Download size={16} />
                  </div>
                  <div>
                    <div>CSV Document</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '400' }}>Raw .csv format</div>
                  </div>
                </button>
              </div>
            )}
          </div>
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

      {/* Download Completion Toast Notification */}
      {downloadToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          maxWidth: '440px',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#10b981', color: '#ffffff', flexShrink: 0 }}>
            <CheckCircle2 size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '2px', color: '#f8fafc' }}>
              Structured Report Exported!
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Well-structured <strong>{downloadToast.format}</strong> generated and downloaded:
            </div>
            <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontFamily: 'monospace', marginTop: '4px', wordBreak: 'break-all' }}>
              {downloadToast.filename}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
              Downloaded at: {downloadToast.time}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setDownloadToast(null)} 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
