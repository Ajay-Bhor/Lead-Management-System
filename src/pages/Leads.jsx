import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Trash2, 
  Building, 
  User, 
  Edit2, 
  RotateCcw, 
  Download, 
  Eye, 
  Calendar, 
  Phone, 
  Mail, 
  Tag, 
  CheckSquare, 
  Square, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  SlidersHorizontal, 
  X, 
  Plus,
  FileSpreadsheet,
  ChevronDown,
  PhoneCall, 
  Video, 
  FileText, 
  DollarSign, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  MoreVertical,
  Sliders
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import AddLeadModal from '../components/AddLeadModal';
import EditLeadModal from '../components/EditLeadModal';

const Leads = () => {
  const navigate = useNavigate();
  const { leads, deleteLead, openEditLead, updateLeadStatus, reassignLead, addActivity, simulateLeadCapture, currentUser } = useLeads();
  const [downloadToast, setDownloadToast] = useState(null);

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Row 2 Filters: Status | Source | Priority | Assigned To
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterAssignedTo, setFilterAssignedTo] = useState('All');

  // Row 3 Filters: Created From | Created To | Follow-up From | Follow-up To
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [followUpFrom, setFollowUpFrom] = useState('');
  const [followUpTo, setFollowUpTo] = useState('');

  // Modals & UI States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activityModalLead, setActivityModalLead] = useState(null);
  const [activityForm, setActivityForm] = useState({ type: 'Phone Call', title: '', outcome: 'Connected', description: '' });
  const [isSavingActivity, setIsSavingActivity] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Selection
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const safeLeads = Array.isArray(leads) ? leads : [];

  // Filter Logic
  const filteredLeads = useMemo(() => {
    return safeLeads.filter(lead => {
      const name = (lead?.name || '').toLowerCase();
      const company = (lead?.company || '').toLowerCase();
      const email = (lead?.email || '').toLowerCase();
      const phone = (lead?.phone || '').toLowerCase();
      const globalTerm = searchTerm.toLowerCase().trim();

      // Row 1: Search
      if (globalTerm) {
        const matchesGlobal = name.includes(globalTerm) || 
                              company.includes(globalTerm) || 
                              email.includes(globalTerm) || 
                              phone.includes(globalTerm) ||
                              (lead?.territory || '').toLowerCase().includes(globalTerm);
        if (!matchesGlobal) return false;
      }

      // Row 2: Status, Source, Priority, Assigned To
      if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
      if (filterSource !== 'All' && lead.source !== filterSource) return false;
      if (filterPriority !== 'All' && (lead.priority || 'Normal') !== filterPriority) return false;
      if (filterAssignedTo !== 'All' && lead.assignedTo !== filterAssignedTo) return false;

      // Row 3: Created & Follow-up Dates
      const leadCreated = lead.createdDate || lead.date;
      if (createdFrom && (!leadCreated || new Date(leadCreated) < new Date(createdFrom))) return false;
      if (createdTo && (!leadCreated || new Date(leadCreated) > new Date(createdTo))) return false;

      const leadFollowUp = lead.followUpDate;
      if (followUpFrom && (!leadFollowUp || new Date(leadFollowUp) < new Date(followUpFrom))) return false;
      if (followUpTo && (!leadFollowUp || new Date(leadFollowUp) > new Date(followUpTo))) return false;

      return true;
    });
  }, [
    safeLeads, searchTerm, filterStatus, filterSource, filterPriority, filterAssignedTo, 
    createdFrom, createdTo, followUpFrom, followUpTo
  ]);

  // Sort Logic
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'dealValue' || sortField === 'expectedValue') {
        valA = Number(a.dealValue || a.expectedValue || 0);
        valB = Number(b.dealValue || b.expectedValue || 0);
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      if (sortField === 'createdDate') {
        valA = new Date(a.createdDate || a.date || 0).getTime();
        valB = new Date(b.createdDate || b.date || 0).getTime();
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      if (sortField === 'followUpDate') {
        valA = new Date(a.followUpDate || '2099-01-01').getTime();
        valB = new Date(b.followUpDate || '2099-01-01').getTime();
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      valA = String(valA || '').toLowerCase();
      valB = String(valB || '').toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortField, sortOrder]);

  // Pagination Logic
  const totalItems = sortedLeads.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(paginatedLeads.map(l => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedLeadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isAllSelected = paginatedLeads.length > 0 && paginatedLeads.every(l => selectedLeadIds.includes(l.id));

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterSource('All');
    setFilterPriority('All');
    setFilterAssignedTo('All');
    setCreatedFrom('');
    setCreatedTo('');
    setFollowUpFrom('');
    setFollowUpTo('');
    setCurrentPage(1);
  };

  const [exportMenuOpen, setExportMenuOpen] = useState(false);

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

  // Export Excel (.xlsx) well-structured workbook
  const handleExportExcel = () => {
    const ts = getFormattedTimestamp();
    const totalPipelineValue = sortedLeads.reduce((sum, l) => sum + (parseFloat(l.dealValue || l.expectedValue) || 0), 0);

    const leadsAOA = [
      ['URJA FOODS & AGRO ENTERPRISES'],
      ['ENTERPRISE LEAD MANAGEMENT SYSTEM (LMS) - FILTERED LEADS AUDIT'],
      ['CONFIDENTIAL CLIENT & PIPELINE REGISTRY'],
      [],
      ['REPORT PARAMETERS & METADATA'],
      ['Report Generated At', ts.display],
      ['Audited By', `${currentUser?.name || 'Ajay Bhor'} (${currentUser?.role || 'Admin'})`],
      ['Total Leads in Filtered View', sortedLeads.length],
      ['Total Aggregate Deal Value', `₹${(totalPipelineValue / 100000).toFixed(2)} Lakh`],
      ['Active Filter: Status', filterStatus],
      ['Active Filter: Source', filterSource],
      ['Active Filter: Priority', filterPriority],
      ['Active Filter: Assigned Rep', filterAssignedTo],
      [],
      ['S.No', 'Lead ID', 'Lead / Client Name', 'Company Name', 'Contact Phone', 'Email Address', 'Lead Source', 'Pipeline Status', 'Priority', 'Assigned Rep', 'Expected Deal Value (₹)', 'Creation Date', 'Next Follow-up Date', 'Strategic Requirement Notes'],
      ...sortedLeads.map((l, index) => [
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
        `${sortedLeads.length} Leads`,
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        totalPipelineValue,
        '-',
        '-',
        '-'
      ]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(leadsAOA);
    ws['!cols'] = [
      { wch: 8 }, { wch: 16 }, { wch: 28 }, { wch: 28 }, { wch: 16 }, { wch: 28 }, { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 20 }, { wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 35 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Filtered Leads');
    const fileName = `Urja_Foods_Leads_Report_${ts.fileDate}_${ts.fileTime}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setDownloadToast({
      format: 'Excel (.xlsx)',
      filename: fileName,
      time: ts.display
    });
    setTimeout(() => setDownloadToast(null), 6000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const ts = getFormattedTimestamp();
    const totalPipelineValue = sortedLeads.reduce((sum, l) => sum + (parseFloat(l.dealValue || l.expectedValue) || 0), 0);

    let csv = '# ====================================================================\n';
    csv += '# URJA FOODS & AGRO ENTERPRISES - LEAD MANAGEMENT SYSTEM\n';
    csv += '# FILTERED LEADS AUDIT & REGISTRY REPORT\n';
    csv += `# GENERATED AT: ${ts.display}\n`;
    csv += `# GENERATED BY: ${currentUser?.name || 'Ajay Bhor'} (${currentUser?.role || 'Admin'})\n`;
    csv += `# FILTER CRITERIA: Status=${filterStatus}, Source=${filterSource}, Priority=${filterPriority}\n`;
    csv += `# TOTAL FILTERED LEADS: ${sortedLeads.length} | TOTAL EXPECTED VALUE: ₹${totalPipelineValue}\n`;
    csv += '# ====================================================================\n\n';

    csv += 'S.No,Lead ID,Lead Name,Company,Phone,Email,Source,Status,Priority,Assigned To,Expected Value (INR),Created Date,Follow-up Date,Notes\n';
    sortedLeads.forEach((l, idx) => {
      csv += `${idx + 1},"${l.id || ''}","${l.name}","${l.company || ''}","${l.phone || ''}","${l.email || ''}","${l.source || ''}","${l.status}","${l.priority || 'Normal'}","${l.assignedTo || ''}",${l.dealValue || l.expectedValue || 0},"${l.createdDate || l.date || ''}","${l.followUpDate || ''}","${(l.notes || '').replace(/"/g, '""')}"\n`;
    });
    csv += `TOTALS,"${sortedLeads.length} Leads",-,-,-,-,-,-,-,-,${totalPipelineValue},-,-,-\n`;

    const encoded = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    const fileName = `Urja_Foods_Leads_Report_${ts.fileDate}_${ts.fileTime}.csv`;
    link.setAttribute('download', fileName);
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

  // Save Quick Activity
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!activityForm.title.trim() || !activityModalLead) return;

    setIsSavingActivity(true);
    await addActivity(activityModalLead.id, {
      type: activityForm.type,
      title: activityForm.title.trim(),
      outcome: activityForm.outcome,
      description: activityForm.description.trim() || `Recorded ${activityForm.type} with client`
    });

    setIsSavingActivity(false);
    setActivityModalLead(null);
    setActivityForm({ type: 'Phone Call', title: '', outcome: 'Connected', description: '' });
  };

  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowUpDown size={13} style={{ opacity: 0.3 }} />;
    return sortOrder === 'asc' ? <ArrowUp size={13} color="#2563eb" /> : <ArrowDown size={13} color="#2563eb" />;
  };

  const formatCurrency = (val) => {
    if (!val || val === 0) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* 1. LARGE PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Lead Search & Discovery
            </h1>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe'
            }}>
              {filteredLeads.length} of {safeLeads.length} Records
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.94rem', marginTop: '4px' }}>
            Search, filter, and track pipeline leads across all acquisition channels and stages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      {/* 2. LARGE SEARCH / FILTER PANEL (ARRANGED ACROSS 4 DISTINCT ROWS) */}
      <div className="card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ROW 1: FULL-WIDTH, LARGE HEIGHT SEARCH BAR */}
        <div>
          <label className="form-label" style={{ fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>
            Row 1 — Global Search Query
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search leads by Contact Name, Company, Email, Phone number, or City..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="form-input"
              style={{
                width: '100%',
                minHeight: '52px',
                paddingLeft: '48px',
                paddingRight: searchTerm ? '40px' : '16px',
                fontSize: '1rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: STATUS | SOURCE | PRIORITY | ASSIGNED TO */}
        <div>
          <label className="form-label" style={{ fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>
            Row 2 — Categorical Parameters
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Status */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Lead Source</label>
              <select
                value={filterSource}
                onChange={(e) => { setFilterSource(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              >
                <option value="All">All Sources</option>
                <option value="Website forms">Website forms</option>
                <option value="Social media">Social media</option>
                <option value="Email campaigns">Email campaigns</option>
                <option value="Phone calls">Phone calls</option>
                <option value="Manual entry">Manual entry</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Priority Level</label>
              <select
                value={filterPriority}
                onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Assigned Sales Executive</label>
              <select
                value={filterAssignedTo}
                onChange={(e) => { setFilterAssignedTo(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              >
                <option value="All">All Sales Representatives</option>
                <option value="Ajay Bhor">Ajay Bhor</option>
                <option value="Sarah Smith">Sarah Smith</option>
                <option value="Suresh Patil">Suresh Patil</option>
                <option value="Priya Sharma">Priya Sharma</option>
                <option value="Auto Round-Robin">Auto Round-Robin</option>
              </select>
            </div>
          </div>
        </div>

        {/* ROW 3: CREATED FROM | CREATED TO | FOLLOW-UP FROM | FOLLOW-UP TO */}
        <div>
          <label className="form-label" style={{ fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>
            Row 3 — Date Lifecycles
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Created From</label>
              <input
                type="date"
                value={createdFrom}
                onChange={(e) => { setCreatedFrom(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Created To</label>
              <input
                type="date"
                value={createdTo}
                onChange={(e) => { setCreatedTo(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Follow-up From</label>
              <input
                type="date"
                value={followUpFrom}
                onChange={(e) => { setFollowUpFrom(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>Follow-up To</label>
              <input
                type="date"
                value={followUpTo}
                onChange={(e) => { setFollowUpTo(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ minHeight: '46px', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* ROW 4: SEARCH BUTTON | RESET | EXPORT */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Button */}
            <button
              onClick={() => setCurrentPage(1)}
              className="btn-primary"
              style={{ padding: '11px 24px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Search size={16} />
              <span>Apply Filters ({filteredLeads.length} Matches)</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="btn-secondary"
              style={{ padding: '11px 20px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw size={15} />
              <span>Reset All</span>
            </button>
          </div>

          {/* Dual Excel & CSV Export Button */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(37,99,235,0.15)'
            }}>
              <button
                type="button"
                onClick={handleExportExcel}
                className="btn-secondary"
                style={{
                  padding: '11px 18px',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2563eb',
                  borderColor: '#bfdbfe',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: '#ffffff'
                }}
                title="Download filtered leads as Excel (.xlsx) file"
              >
                <FileSpreadsheet size={16} />
                <span>Export Leads (Excel)</span>
              </button>
              <button
                type="button"
                onClick={() => setExportMenuOpen(prev => !prev)}
                className="btn-secondary"
                style={{
                  padding: '11px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: 'none',
                  borderColor: '#bfdbfe',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  cursor: 'pointer'
                }}
                title="Choose Export Format (Excel / CSV)"
              >
                <ChevronDown size={15} />
              </button>
            </div>

            {exportMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
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
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '400' }}>Full .xlsx spreadsheet</div>
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
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '400' }}>Standard .csv format</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. LARGE LEAD TABLE (LARGE ROW HEIGHT, COMFORTABLE CELL PADDING, STICKY HEADER, CLEAR SEPARATION) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '720px' }}>
          <table className="crm-table" style={{ minWidth: '1100px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {/* Checkbox */}
                <th style={{ width: '48px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                </th>

                {/* Lead Name (Sortable) */}
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Lead Name</span>
                    {renderSortArrow('name')}
                  </div>
                </th>

                {/* Company (Sortable) */}
                <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Company</span>
                    {renderSortArrow('company')}
                  </div>
                </th>

                {/* Contact (Phone & Email) */}
                <th>Contact Info</th>

                {/* Source */}
                <th>Source</th>

                {/* Status (Sortable) */}
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Status</span>
                    {renderSortArrow('status')}
                  </div>
                </th>

                {/* Priority */}
                <th>Priority</th>

                {/* Assigned To (Sortable) */}
                <th onClick={() => handleSort('assignedTo')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Assigned Salesperson</span>
                    {renderSortArrow('assignedTo')}
                  </div>
                </th>

                {/* Created Date (Sortable) */}
                <th onClick={() => handleSort('createdDate')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Created Date</span>
                    {renderSortArrow('createdDate')}
                  </div>
                </th>

                {/* Follow-up Date */}
                <th>Follow-up Date</th>

                {/* Expected Value (Sortable) */}
                <th onClick={() => handleSort('dealValue')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Expected Value</span>
                    {renderSortArrow('dealValue')}
                  </div>
                </th>

                {/* Actions */}
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={26} />
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        No leads match your criteria
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Try clearing or relaxing your search parameters in the rows above.
                      </p>
                      <button onClick={handleResetFilters} className="btn-secondary" style={{ padding: '9px 20px', fontSize: '0.88rem', marginTop: '6px' }}>
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map(lead => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  const statusClass = `badge badge-${lead.status.toLowerCase().replace(/\s+/g, '')}`;
                  const priorityClass = lead.priority === 'High' || lead.priority === 'Hot' ? 'badge badge-lost' : lead.priority === 'Medium' || lead.priority === 'Warm' ? 'badge badge-warning' : 'badge badge-new';
                  const initials = (lead.name || 'L').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                  return (
                    <tr 
                      key={lead.id}
                      style={{
                        backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                        transition: 'background-color 0.12s ease'
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(lead.id)}
                          style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Lead Name (with initials avatar and clickable link) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1.5px solid #bfdbfe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.82rem',
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div>
                            <Link 
                              to={`/leads/${lead.id}`} 
                              style={{ fontWeight: '800', color: '#0f172a', textDecoration: 'none', fontSize: '0.94rem' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#0f172a'}
                            >
                              {lead.name}
                            </Link>
                            {lead.territory && (
                              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                {lead.territory}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building size={16} color="#94a3b8" />
                          <span style={{ fontWeight: '700', color: '#334155', fontSize: '0.88rem' }}>
                            {lead.company || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Contact Info (Stacked Phone & Email) */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.82rem' }}>
                          {lead.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: '500' }}>
                              <Phone size={13} color="#16a34a" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                              <Mail size={13} color="#94a3b8" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          padding: '3px 10px',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569'
                        }}>
                          {lead.source || 'Website forms'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span className={statusClass}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Priority Badge */}
                      <td>
                        <span className={priorityClass}>
                          {lead.priority || 'Normal'}
                        </span>
                      </td>

                      {/* Assigned Sales Executive */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(lead.assignedTo || 'U')[0]}
                          </div>
                          <span style={{ fontSize: '0.86rem', fontWeight: '600', color: '#0f172a' }}>
                            {lead.assignedTo || 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          {lead.createdDate || lead.date ? new Date(lead.createdDate || lead.date).toLocaleDateString() : 'Aug 26, 2026'}
                        </span>
                      </td>

                      {/* Follow-up Date */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '700' }}>
                          {lead.followUpDate || 'Sep 25, 2026'}
                        </span>
                      </td>

                      {/* Expected Value */}
                      <td>
                        <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                          {formatCurrency(lead.dealValue || lead.expectedValue || 750000)}
                        </span>
                      </td>

                      {/* Actions: View, Edit, Add Activity, Delete */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          {/* View */}
                          <button
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            title="View Individual Lead Profile & Timeline"
                            style={{ border: 'none', backgroundColor: '#eff6ff', color: '#2563eb', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditLead(lead)}
                            title="Edit Lead Details"
                            style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#475569', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Add Activity */}
                          <button
                            onClick={() => setActivityModalLead(lead)}
                            title="Add Activity (Call, Meeting, Note)"
                            style={{ border: 'none', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <PhoneCall size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete lead "${lead.name}"?`)) {
                                deleteLead(lead.id);
                              }
                            }}
                            title="Delete Lead Record"
                            style={{ border: 'none', backgroundColor: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. SPACIOUS PAGINATION BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 28px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Left: Range and Page Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: '#64748b' }}>
            <span>
              Showing <strong>{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> of <strong>{totalItems}</strong> leads
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', color: '#0f172a', cursor: 'pointer' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>per page</span>
            </div>
          </div>

          {/* Right: Previous, Page Numbers, Next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.86rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  border: currentPage === pageNum ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: currentPage === pageNum ? '#2563eb' : '#ffffff',
                  color: currentPage === pageNum ? '#ffffff' : '#334155',
                  fontSize: '0.88rem',
                  fontWeight: currentPage === pageNum ? '800' : '600',
                  cursor: 'pointer'
                }}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.86rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK "ADD ACTIVITY" MODAL */}
      {activityModalLead && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Log Activity
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#2563eb', fontWeight: '700' }}>
                  {activityModalLead.name} — {activityModalLead.company}
                </span>
              </div>
              <button
                onClick={() => setActivityModalLead(null)}
                style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Interaction Channel</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Phone Call', 'Email', 'Meeting', 'WhatsApp', 'Demo', 'Follow-up'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActivityForm({ ...activityForm, type })}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: activityForm.type === type ? '700' : '500',
                        backgroundColor: activityForm.type === type ? '#2563eb' : '#ffffff',
                        color: activityForm.type === type ? '#ffffff' : '#475569',
                        border: `1.5px solid ${activityForm.type === type ? '#2563eb' : '#cbd5e1'}`,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Subject / Purpose *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Discussed contract terms & delivery lead time"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Outcome</label>
                <select
                  value={activityForm.outcome}
                  onChange={(e) => setActivityForm({ ...activityForm, outcome: e.target.value })}
                  className="form-input"
                >
                  <option value="Connected">Connected & Positive</option>
                  <option value="Interested">High Interest - Send Proposal</option>
                  <option value="Demo Scheduled">Product Demo Scheduled</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Left Voicemail">Left Voicemail / No Answer</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>

              <div>
                <label className="form-label">Discussion Notes</label>
                <textarea
                  rows={3}
                  placeholder="Minutes of discussion..."
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActivityModalLead(null)}
                  className="btn-secondary"
                  style={{ padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingActivity}
                  className="btn-primary"
                  style={{ padding: '9px 24px' }}
                >
                  {isSavingActivity ? 'Saving...' : 'Save Activity Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      )}

      {/* Edit Lead Modal */}
      <EditLeadModal />

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
            <CheckSquare size={20} />
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

export default Leads;
