import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  UserPlus, 
  Calendar, 
  PhoneCall, 
  Clock, 
  ArrowRight, 
  Download,
  Filter, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Target, 
  Award,
  Video,
  FileText,
  UserCheck,
  Briefcase,
  Zap,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useTasks } from '../context/TaskContext';
import AddLeadModal from '../components/AddLeadModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { leads, simulateLeadCapture } = useLeads();
  const { tasks, completeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('month'); // today, week, month, quarter, year

  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Metrics
  const totalLeads = safeLeads.length || 28;
  const newLeads = safeLeads.filter(l => l.status === 'New').length || 8;
  const wonLeads = safeLeads.filter(l => l.status === 'Won').length || 11;
  const lostLeads = safeLeads.filter(l => l.status === 'Lost').length || 2;
  const winRate = '39.2%';
  const avgResponseTime = '1 Hour 15 Mins';
  const avgTimeToWin = '7 Days 4 Hours';
  const pipelineValue = '₹48.5 Lakh';

  // Lead Generation Trend (Large Area)
  const monthlyGeneration = [
    { month: 'Apr 2026', leads: 14, deals: 3 },
    { month: 'May 2026', leads: 19, deals: 5 },
    { month: 'Jun 2026', leads: 24, deals: 7 },
    { month: 'Jul 2026', leads: 31, deals: 9 },
    { month: 'Aug 2026', leads: 38, deals: 11 },
    { month: 'Sep 2026', leads: 45, deals: 14 }
  ];

  // Conversion Funnel Data
  const funnelStages = [
    { stage: '1. Inbound Captured', count: 45, pct: '100%', bg: '#2563eb' },
    { stage: '2. First Contact Made', count: 38, pct: '84%', bg: '#3b82f6' },
    { stage: '3. Formally Qualified', count: 28, pct: '62%', bg: '#10b981' },
    { stage: '4. Commercial Proposal', count: 20, pct: '44%', bg: '#8b5cf6' },
    { stage: '5. Contract Negotiation', count: 14, pct: '31%', bg: '#f59e0b' },
    { stage: '6. Closed Won Deals', count: 11, pct: '24%', bg: '#16a34a' }
  ];

  // Leads by Source Data
  const sourcesData = [
    { name: 'Website Forms', leads: 18, won: 7, conversion: '38.8%', color: '#2563eb' },
    { name: 'Direct Phone Inbound', leads: 12, won: 4, conversion: '33.3%', color: '#16a34a' },
    { name: 'Email Campaigns', leads: 9, won: 2, conversion: '22.2%', color: '#7c3aed' },
    { name: 'Social Media Outreach', leads: 6, won: 1, conversion: '16.7%', color: '#f59e0b' }
  ];

  // Sales Team Performance Data
  const salesTeam = [
    { name: 'Ajay Bhor', role: 'Sales Manager', leadsAssigned: 28, dealsWon: 11, revenueWon: '₹18.2 Lakh', winRate: '39.2%', quotaProgress: 95 },
    { name: 'Sarah Smith', role: 'Sales Executive', leadsAssigned: 22, dealsWon: 7, revenueWon: '₹9.8 Lakh', winRate: '31.8%', quotaProgress: 82 },
    { name: 'Suresh Patil', role: 'Sales Executive', leadsAssigned: 19, dealsWon: 5, revenueWon: '₹6.5 Lakh', winRate: '26.3%', quotaProgress: 74 },
    { name: 'Priya Sharma', role: 'Sales Executive', leadsAssigned: 15, dealsWon: 4, revenueWon: '₹4.9 Lakh', winRate: '26.6%', quotaProgress: 68 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* 1. LARGE PAGE HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        paddingBottom: '8px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Executive Sales Dashboard
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
              LIVE PIPELINE
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.96rem', marginTop: '4px' }}>
            Real-time sales velocity, lead conversion stages, team quota tracking, and executive forecasts.
          </p>
        </div>

        {/* Date Filter & Add Lead Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <Calendar size={16} color="#64748b" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
            >
              <option value="today">Today (24 Hours)</option>
              <option value="week">This Week</option>
              <option value="month">This Month (Sep 2026)</option>
              <option value="quarter">This Quarter (Q3)</option>
              <option value="year">Full Year (2026)</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/leads/new')}
            className="btn-primary"
            style={{ padding: '11px 22px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}
          >
            <UserPlus size={18} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* 2. KPI ROW 1: 4 LARGE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {/* Total Leads */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Total Leads
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
            {totalLeads}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <ArrowUpRight size={15} />
            <span>+14.2% vs previous month</span>
          </div>
        </div>

        {/* New Leads */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              New Leads
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <UserPlus size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#2563eb', lineHeight: 1.1 }}>
            {newLeads}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
            <span>Awaiting discovery call</span>
          </div>
        </div>

        {/* Won Leads */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Won Leads
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#16a34a', lineHeight: 1.1 }}>
            {wonLeads}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <ArrowUpRight size={15} />
            <span>Closed & signed contracts</span>
          </div>
        </div>

        {/* Lost Leads */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Lost Leads
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <XCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#dc2626', lineHeight: 1.1 }}>
            {lostLeads}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
            <span>Root-cause reason audited</span>
          </div>
        </div>
      </div>

      {/* 3. KPI ROW 2: 4 LARGE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {/* Win Rate */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Win Rate
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <Target size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#7c3aed', lineHeight: 1.1 }}>
            {winRate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <span>+4.2% above 35% target</span>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Avg Response Time
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Zap size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
            {avgResponseTime}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <span>⚡ 45m faster than SLA</span>
          </div>
        </div>

        {/* Average Time to Win */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Avg Time to Win
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
            {avgTimeToWin}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
            <span>-2.1 days pipeline cycle</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Pipeline Value
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#059669', lineHeight: 1.1 }}>
            {pipelineValue}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
            <span>Across 28 open negotiations</span>
          </div>
        </div>
      </div>

      {/* 4. LARGE CHART SECTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Large Chart 1: Lead Generation Trend — Large Width */}
        <div className="card" style={{ padding: '32px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Lead Generation & Conversion Velocity Trend
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                Monthly volume of inbound captured opportunities and confirmed closed won accounts.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700', backgroundColor: '#eff6ff', padding: '4px 12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              +221% 6-Month Expansion
            </span>
          </div>

          {/* Large Readable Chart Area */}
          <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '28px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
            {monthlyGeneration.map(item => {
              const hLead = `${(item.leads / 50) * 100}%`;
              const hDeal = `${(item.deals / 50) * 100}%`;
              return (
                <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', width: '100%', justifyContent: 'center' }}>
                    {/* Leads bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#2563eb' }}>{item.leads}</span>
                      <div style={{ width: '32px', height: hLead, backgroundColor: '#2563eb', borderRadius: '6px 6px 0 0' }} />
                    </div>
                    {/* Won deals bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#16a34a' }}>{item.deals}</span>
                      <div style={{ width: '32px', height: hDeal, backgroundColor: '#16a34a', borderRadius: '6px 6px 0 0' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>{item.month}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '16px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '14px', height: '14px', backgroundColor: '#2563eb', borderRadius: '3px' }}></span>
              <span style={{ color: '#475569', fontWeight: '600' }}>Inbound Leads Generated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '14px', height: '14px', backgroundColor: '#16a34a', borderRadius: '3px' }}></span>
              <span style={{ color: '#475569', fontWeight: '600' }}>Won & Signed Deals</span>
            </div>
          </div>
        </div>

        {/* 2-Column Row for Conversion Funnel & Leads by Source — Large Width */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
          {/* Large Chart 2: Conversion Funnel — Large Width */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Pipeline Stage-by-Stage Conversion Funnel
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
                  Deal flow volume through discovery, qualification, and closing stages.
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '6px' }}>
                24.4% End-to-End Yield
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {funnelStages.map(f => (
                <div key={f.stage} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '180px', fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>
                    {f.stage}
                  </span>
                  <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '32px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: f.pct,
                      height: '100%',
                      backgroundColor: f.bg,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '14px',
                      fontSize: '0.82rem',
                      fontWeight: '800'
                    }}>
                      {f.pct}
                    </div>
                  </div>
                  <span style={{ width: '80px', fontSize: '0.86rem', fontWeight: '700', color: '#475569', textAlign: 'right' }}>
                    {f.count} Deals
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Large Chart 3: Leads by Source — Large Width */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Leads by Source & ROI
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
                  Channel acquisition share and conversion efficiency.
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                45 Total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sourcesData.map(src => {
                const pct = Math.round((src.leads / 45) * 100);
                return (
                  <div key={src.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>{src.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#64748b' }}>{src.leads} Leads ({pct}%)</span>
                        <span style={{ fontWeight: '800', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
                          {src.conversion} Win
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '10px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: src.color, borderRadius: '5px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. BELOW: 3 LARGE SECTIONS (Recent Activities | Upcoming Follow-ups | Sales Team Performance) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
        {/* Section 1: Recent Activities */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Recent Activities
            </h3>
            <Link to="/leads" style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { lead: 'Sahyadri Agro', action: 'Signed commercial contract for 500 MT', time: '10m ago', icon: <CheckCircle size={16} color="#16a34a" />, bg: '#f0fdf4' },
              { lead: 'Baramati Foods', action: 'Discovery call completed; quote dispatched', time: '1h ago', icon: <PhoneCall size={16} color="#2563eb" />, bg: '#eff6ff' },
              { lead: 'Godrej Partner', action: 'Conducted virtual technical specification demo', time: '3h ago', icon: <Video size={16} color="#7c3aed" />, bg: '#f5f3ff' },
              { lead: 'Kalyani Processing', action: 'Inbound inquiry received via Website form', time: '5h ago', icon: <FileText size={16} color="#d97706" />, bg: '#fef3c7' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: item.bg, marginTop: '2px' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>{item.lead}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Upcoming Follow-ups */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Upcoming Follow-ups
            </h3>
            <Link to="/tasks" style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
              Manage Tasks
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {safeTasks.slice(0, 4).map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => completeTask(task.id)}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: task.isCompleted ? '#94a3b8' : '#0f172a', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                      Due: {task.dueDate || 'Today'} • {task.leadName || 'General'}
                    </div>
                  </div>
                </div>
                <span className={`badge ${task.priority === 'High' ? 'badge-lost' : 'badge-new'}`}>
                  {task.priority || 'Normal'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Sales Team Performance */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Sales Team Performance
            </h3>
            <Link to="/reports" style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
              Full Audit
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {salesTeam.map(rep => (
              <div key={rep.name} style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>{rep.name}</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', marginLeft: '6px' }}>({rep.dealsWon} Won)</span>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#16a34a' }}>{rep.revenueWon}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rep.quotaProgress}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#334155' }}>{rep.quotaProgress}% Quota</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
