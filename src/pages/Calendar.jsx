import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Video, 
  PhoneCall, 
  CheckCircle2, 
  Circle,
  User, 
  Filter,
  CheckSquare,
  X,
  ExternalLink,
  CalendarDays,
  Trash2
} from 'lucide-react';

// Comprehensive realistic sales schedule items across key dates
const INITIAL_SCHEDULE_EVENTS = [
  {
    id: 101,
    title: 'Product Demonstration & Technical Specs',
    leadName: 'Vikram Joshi',
    company: 'Sahyadri Agro Industries Ltd',
    leadId: '1',
    type: 'Demo',
    date: '2026-09-24',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    rep: 'Ajay Bhor',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/abc-urja-demo',
    priority: 'High',
    notes: 'Walkthrough quarterly bulk supply specs, cold-chain transport parameters, and pricing tiers.'
  },
  {
    id: 102,
    title: 'Commercial Contract Negotiation Call',
    leadName: 'Nitin Gadre',
    company: 'Baramati Agro Foods Ltd',
    leadId: '2',
    type: 'Meeting',
    date: '2026-09-24',
    startTime: '02:30 PM',
    endTime: '03:30 PM',
    rep: 'Ajay Bhor',
    status: 'Pending',
    meetingLink: 'https://meet.google.com/xyz-urja-deal',
    priority: 'High',
    notes: 'Negotiate 30-day settlement terms and 5% volume incentive on 500 MT order.'
  },
  {
    id: 103,
    title: 'Send Revised Volume Quotation with Discount Breakdown',
    leadName: 'Vikram Joshi',
    company: 'Sahyadri Agro Industries Ltd',
    leadId: '1',
    type: 'Task',
    date: '2026-09-24',
    startTime: '04:30 PM',
    endTime: '05:00 PM',
    rep: 'Ajay Bhor',
    status: 'Pending',
    priority: 'High',
    notes: 'Incorporate QA audit lab report and 30-day payment term schedule.'
  },
  {
    id: 104,
    title: 'Executive Follow-up Call & Requirements Discovery',
    leadName: 'Anil Deshmukh',
    company: 'Maharashtra Cold Storage Ltd',
    leadId: '3',
    type: 'Call',
    date: '2026-09-24',
    startTime: '05:15 PM',
    endTime: '05:45 PM',
    rep: 'Sarah Smith',
    status: 'Confirmed',
    priority: 'Medium',
    notes: 'Discuss monthly supply capacity for Pune distribution center.'
  },
  // Today: Sep 23
  {
    id: 201,
    title: 'Daily Sales Standup & Velocity Review',
    leadName: 'Internal Team',
    company: 'Urja Foods Sales Operations',
    type: 'Meeting',
    date: '2026-09-23',
    startTime: '09:30 AM',
    endTime: '10:00 AM',
    rep: 'Ajay Bhor',
    status: 'Completed',
    meetingLink: 'https://meet.google.com/urja-standup',
    priority: 'Medium',
    notes: 'Review Q3 targets, follow-up backlog, and stage transitions.'
  },
  {
    id: 202,
    title: 'Inbound Discovery Call: Packaging Requirements',
    leadName: 'Rajesh Kulkarni',
    company: 'Pune Food Processing Hub',
    type: 'Call',
    date: '2026-09-23',
    startTime: '11:45 AM',
    endTime: '12:15 PM',
    rep: 'Suresh Patil',
    status: 'Completed',
    priority: 'High',
    notes: 'Prospect confirmed 200 MT monthly requirement starting October.'
  },
  {
    id: 203,
    title: 'Technical Specification QA Compliance Validation',
    leadName: 'Quality Assurance Team',
    company: 'Sahyadri Agro Industries Ltd',
    type: 'Task',
    date: '2026-09-23',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    rep: 'Ajay Bhor',
    status: 'Completed',
    priority: 'High',
    notes: 'Audit pesticide residue test lab certificates and attach to deal.'
  },
  {
    id: 204,
    title: 'Virtual Demonstration of Bulk Packaging Lines',
    leadName: 'Sunita Patel',
    company: 'Gujarat Bio Agri Corp',
    type: 'Demo',
    date: '2026-09-23',
    startTime: '04:30 PM',
    endTime: '05:30 PM',
    rep: 'Sarah Smith',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/gujarat-demo',
    priority: 'Medium',
    notes: 'Present automated vacuum packing lines and batch traceability.'
  },
  // Sep 25
  {
    id: 301,
    title: 'Quarterly Supply Delivery Review Call',
    leadName: 'Mahesh Sharma',
    company: 'Godrej Agrovet Partner',
    type: 'Call',
    date: '2026-09-25',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    rep: 'Sarah Smith',
    status: 'Confirmed',
    priority: 'Medium',
    notes: 'Review Q4 delivery schedule and warehouse pickup slots.'
  },
  {
    id: 302,
    title: 'Client Onboarding Sync & Account Setup',
    leadName: 'Deepak Shinde',
    company: 'Solapur Agro Mills Ltd',
    type: 'Meeting',
    date: '2026-09-25',
    startTime: '03:30 PM',
    endTime: '04:30 PM',
    rep: 'Ajay Bhor',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/solapur-sync',
    priority: 'High',
    notes: 'Handover to delivery ops and configure GST invoicing profile.'
  },
  // Sep 26
  {
    id: 401,
    title: 'Weekly Sales Pipeline Progress Audit',
    leadName: 'Executive Committee',
    company: 'Urja Foods HQ',
    type: 'Meeting',
    date: '2026-09-26',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    rep: 'Ajay Bhor',
    status: 'Confirmed',
    priority: 'High',
    notes: 'Present deal conversion velocities, lost deal audits, and forecasts.'
  },
  // Sep 27
  {
    id: 501,
    title: 'First Discovery Meeting & MOQ Finalization',
    leadName: 'Prakash Kalyani',
    company: 'Kalyani Food Processing Ltd',
    type: 'Demo',
    date: '2026-09-27',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    rep: 'Suresh Patil',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/kalyani-discovery',
    priority: 'Medium',
    notes: 'Demonstrate custom packaging options and minimum order quantities.'
  },
  // Sep 28
  {
    id: 601,
    title: 'Enterprise Commercial Contract Finalization',
    leadName: 'Vikram Joshi',
    company: 'Sahyadri Agro Industries Ltd',
    type: 'Meeting',
    date: '2026-09-28',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    rep: 'Ajay Bhor',
    status: 'Pending',
    priority: 'High',
    notes: 'Final physical contract signing ceremony at corporate branch.'
  },
  // Sep 30
  {
    id: 701,
    title: 'Q3 Closing Deals Review & Executive Sign-off',
    leadName: 'Leadership Council',
    company: 'Urja Foods HQ',
    type: 'Meeting',
    date: '2026-09-30',
    startTime: '03:00 PM',
    endTime: '04:30 PM',
    rep: 'Ajay Bhor',
    status: 'Confirmed',
    priority: 'High',
    notes: 'Consolidate Q3 won revenue figures and sales rep bonuses.'
  }
];

const Calendar = () => {
  // State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 23)); // Sep 23, 2026
  const [selectedDate, setSelectedDate] = useState('2026-09-24'); // Default clicked date
  const [typeFilter, setTypeFilter] = useState('All');
  const [repFilter, setRepFilter] = useState('All');
  const [events, setEvents] = useState(INITIAL_SCHEDULE_EVENTS);
  const [dayTabFilter, setDayTabFilter] = useState('All'); // All, Meetings, Demos, Calls, Tasks
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding Activity for selected date
  const [modalForm, setModalForm] = useState({
    title: '',
    leadName: '',
    company: '',
    type: 'Meeting',
    date: '2026-09-24',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    rep: 'Ajay Bhor',
    priority: 'Medium',
    meetingLink: '',
    notes: ''
  });

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date(2026, 8, 23);
    setCurrentDate(today);
    setSelectedDate('2026-09-23');
  };

  // Calendar calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Handle Date Click
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setDayTabFilter('All');
  };

  // Open Add Modal pre-filled for selected date
  const handleOpenAddModal = (dateStr = selectedDate) => {
    setModalForm({
      title: '',
      leadName: '',
      company: '',
      type: 'Meeting',
      date: dateStr,
      startTime: '11:00 AM',
      endTime: '12:00 PM',
      rep: 'Ajay Bhor',
      priority: 'Medium',
      meetingLink: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  // Save new schedule item
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!modalForm.title.trim()) return;

    const newEntry = {
      id: Date.now(),
      ...modalForm,
      status: modalForm.type === 'Task' ? 'Pending' : 'Confirmed'
    };

    setEvents(prev => [newEntry, ...prev]);
    setShowAddModal(false);
  };

  // Toggle status (e.g. Task completed / Meeting confirmed)
  const toggleItemStatus = (id) => {
    setEvents(prev => prev.map(item => {
      if (item.id === id) {
        const isDone = item.status === 'Completed';
        return {
          ...item,
          status: isDone ? 'Pending' : 'Completed'
        };
      }
      return item;
    }));
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Filter events based on global rep filter & type filter
  const allFilteredEvents = useMemo(() => {
    return events.filter(e => {
      if (typeFilter !== 'All' && e.type !== typeFilter) return false;
      if (repFilter !== 'All' && e.rep !== repFilter) return false;
      return true;
    });
  }, [events, typeFilter, repFilter]);

  // Items for the SELECTED clicked date
  const selectedDateItems = useMemo(() => {
    return allFilteredEvents
      .filter(e => e.date === selectedDate)
      .filter(e => {
        if (dayTabFilter === 'All') return true;
        if (dayTabFilter === 'Meetings' && (e.type === 'Meeting' || e.type === 'Demo')) return true;
        if (dayTabFilter === 'Calls' && e.type === 'Call') return true;
        if (dayTabFilter === 'Tasks' && e.type === 'Task') return true;
        return e.type === dayTabFilter;
      });
  }, [allFilteredEvents, selectedDate, dayTabFilter]);

  // Formatted string for selected date
  const formattedSelectedDate = useMemo(() => {
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    return selectedDate;
  }, [selectedDate]);

  // Badge styles by activity type
  const getTypeMeta = (type) => {
    switch (type) {
      case 'Demo':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', icon: <Video size={14} />, label: 'Product Demo' };
      case 'Meeting':
        return { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe', icon: <User size={14} />, label: 'Meeting' };
      case 'Call':
        return { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: <PhoneCall size={14} />, label: 'Phone Call' };
      case 'Task':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: <CheckSquare size={14} />, label: 'Follow-up Task' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', icon: <Clock size={14} />, label: type };
    }
  };

  const getPriorityMeta = (priority) => {
    switch (priority) {
      case 'High': return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
      case 'Medium': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      default: return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
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
              Sales Schedule & Interactive Calendar
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
              CLICK ANY DATE TO OPEN SCHEDULE
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.96rem', marginTop: '4px' }}>
            Click on any date to immediately inspect, schedule, and complete meetings, product demonstrations, calls, and tasks.
          </p>
        </div>

        {/* Global Controls & Add Activity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Representative Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}>
            <User size={15} color="#64748b" />
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Sales Representatives</option>
              <option value="Ajay Bhor">Ajay Bhor</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Suresh Patil">Suresh Patil</option>
              <option value="Priya Sharma">Priya Sharma</option>
            </select>
          </div>

          {/* Activity Type Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}>
            <Filter size={15} color="#64748b" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Activity Types</option>
              <option value="Demo">Product Demos</option>
              <option value="Meeting">Client Meetings</option>
              <option value="Call">Phone Calls</option>
              <option value="Task">Follow-up Tasks</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenAddModal(selectedDate)}
            className="btn-primary"
            style={{ padding: '11px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}
          >
            <Plus size={18} />
            <span>Schedule Activity</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: SPACIOUS 2-PANEL LAYOUT
             LEFT (Calendar Month Grid)
             RIGHT (Open Day Schedule & Tasks Center for the clicked date)
      */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(600px, 1.35fr) minmax(420px, 1fr)',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* ===================== LEFT: CALENDAR MONTH GRID ===================== */}
        <div className="card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
          {/* Calendar Header with Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)'
              }}>
                <CalendarIcon size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {monthName}
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>
                  Click any date square to open its detailed schedule & tasks
                </span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={goToToday}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.84rem', fontWeight: '700', color: '#2563eb' }}
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                className="btn-secondary"
                style={{ padding: '8px 10px', display: 'flex', alignItems: 'center' }}
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMonth}
                className="btn-secondary"
                style={{ padding: '8px 10px', display: 'flex', alignItems: 'center' }}
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <span key={day} style={{
                fontSize: '0.76rem',
                fontWeight: '800',
                color: '#64748b',
                letterSpacing: '0.06em',
                padding: '4px 0'
              }}>
                {day}
              </span>
            ))}
          </div>

          {/* Dynamic Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px'
          }}>
            {/* 1. Leading days from previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const prevDayNum = prevMonthDays - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  style={{
                    minHeight: '105px',
                    borderRadius: '10px',
                    border: '1px dashed #e2e8f0',
                    backgroundColor: '#fafafa',
                    padding: '10px',
                    opacity: 0.45,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#94a3b8' }}>
                    {prevDayNum}
                  </span>
                </div>
              );
            })}

            {/* 2. Days of current month */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = year === 2026 && month === 8 && day === 23;
              const dayEvents = allFilteredEvents.filter(e => e.date === dateStr);
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDateClick(dateStr)}
                  style={{
                    minHeight: '105px',
                    borderRadius: '10px',
                    border: isSelected
                      ? '2.5px solid #2563eb'
                      : isToday
                      ? '2px solid #93c5fd'
                      : '1px solid #e2e8f0',
                    backgroundColor: isSelected
                      ? '#eff6ff'
                      : isToday
                      ? '#f8fafc'
                      : '#ffffff',
                    padding: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(37, 99, 235, 0.15)'
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#93c5fd';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = isToday ? '#93c5fd' : '#e2e8f0';
                      e.currentTarget.style.backgroundColor = isToday ? '#f8fafc' : '#ffffff';
                    }
                  }}
                >
                  {/* Top: Day number + Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.94rem',
                        fontWeight: isSelected || isToday ? '800' : '600',
                        color: isSelected ? '#1d4ed8' : isToday ? '#2563eb' : '#0f172a'
                      }}>
                        {day}
                      </span>
                      {isToday && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: '800',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          letterSpacing: '0.04em'
                        }}>
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Total items badge */}
                    {hasEvents && (
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: '800',
                        backgroundColor: isSelected ? '#2563eb' : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#334155',
                        padding: '1px 6px',
                        borderRadius: '9999px'
                      }}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Middle: Preview event pills inside cell */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                    {dayEvents.slice(0, 2).map(ev => {
                      const meta = getTypeMeta(ev.type);
                      return (
                        <div
                          key={ev.id}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                          title={`${ev.startTime} - ${ev.title}`}
                        >
                          <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: meta.color }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ev.startTime} {ev.type}
                          </span>
                        </div>
                      );
                    })}

                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: '0.64rem', fontWeight: '700', color: '#2563eb', paddingLeft: '2px' }}>
                        +{dayEvents.length - 2} more items
                      </span>
                    )}
                  </div>

                  {/* Bottom selection indicator */}
                  {isSelected && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '0.64rem',
                      fontWeight: '800',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>● OPEN</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Legend:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
              <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Product Demo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed' }} />
              <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Client Meeting</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }} />
              <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Phone Call</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
              <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Follow-up Task</span>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT: DAY SCHEDULE & TASKS CENTER ===================== */}
        {/* Opens immediately when ANY date is clicked */}
        <div className="card" style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header of Selected Day */}
          <div style={{ paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: '800',
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Selected Day Schedule
              </span>

              <button
                onClick={() => handleOpenAddModal(selectedDate)}
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} />
                <span>Add for This Date</span>
              </button>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.2 }}>
              {formattedSelectedDate}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{
                fontSize: '0.76rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: selectedDateItems.length > 0 ? '#eff6ff' : '#f1f5f9',
                color: selectedDateItems.length > 0 ? '#2563eb' : '#64748b'
              }}>
                {selectedDateItems.length} {selectedDateItems.length === 1 ? 'Activity' : 'Activities'} Scheduled
              </span>

              {selectedDate === '2026-09-23' && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8'
                }}>
                  TODAY'S SCHEDULE
                </span>
              )}
            </div>
          </div>

          {/* Filter Pills for this Day */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'Meetings', 'Calls', 'Tasks'].map(tab => (
              <button
                key={tab}
                onClick={() => setDayTabFilter(tab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: dayTabFilter === tab ? '700' : '600',
                  backgroundColor: dayTabFilter === tab ? '#0f172a' : '#f1f5f9',
                  color: dayTabFilter === tab ? '#ffffff' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Timeline Stream of All Tasks & Activities for the Selected Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '580px', overflowY: 'auto' }}>
            {selectedDateItems.length === 0 ? (
              <div style={{
                padding: '48px 20px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
                    No Activities on this Date
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                    There are currently no meetings, calls, or tasks planned for {formattedSelectedDate}.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAddModal(selectedDate)}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem', marginTop: '6px' }}
                >
                  <Plus size={15} />
                  <span>Schedule Activity on this Day</span>
                </button>
              </div>
            ) : (
              selectedDateItems.map(item => {
                const meta = getTypeMeta(item.type);
                const pMeta = getPriorityMeta(item.priority);
                const isCompleted = item.status === 'Completed';

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderLeft: `4px solid ${meta.color}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Top Row: Type Badge + Priority + Status Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: meta.bg,
                          color: meta.color,
                          border: `1px solid ${meta.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {meta.icon}
                          <span>{meta.label}</span>
                        </span>

                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: pMeta.bg,
                          color: pMeta.color,
                          border: `1px solid ${pMeta.border}`
                        }}>
                          {item.priority || 'Normal'}
                        </span>
                      </div>

                      {/* Toggle status button */}
                      <button
                        onClick={() => toggleItemStatus(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          backgroundColor: isCompleted ? '#f0fdf4' : '#f8fafc',
                          color: isCompleted ? '#16a34a' : '#64748b',
                          border: `1px solid ${isCompleted ? '#86efac' : '#cbd5e1'}`
                        }}
                        title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                      >
                        {isCompleted ? <CheckCircle2 size={14} color="#16a34a" /> : <Circle size={14} color="#94a3b8" />}
                        <span>{item.status}</span>
                      </button>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: '800',
                        color: isCompleted ? '#64748b' : '#0f172a',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        margin: 0,
                        lineHeight: 1.3
                      }}>
                        {item.title}
                      </h4>

                      {/* Lead / Client details */}
                      {item.leadName && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px',
                          fontSize: '0.82rem',
                          color: '#475569'
                        }}>
                          <span style={{ fontWeight: '700', color: '#2563eb' }}>
                            {item.leadName}
                          </span>
                          {item.company && (
                            <>
                              <span>•</span>
                              <span style={{ color: '#64748b' }}>{item.company}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Notes if present */}
                    {item.notes && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#475569',
                        margin: 0,
                        backgroundColor: '#f8fafc',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #f1f5f9',
                        lineHeight: 1.4
                      }}>
                        {item.notes}
                      </p>
                    )}

                    {/* Time & Representative Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px',
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '0.78rem',
                      color: '#64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: '#0f172a' }}>
                        <Clock size={13} color="#2563eb" />
                        <span>{item.startTime} {item.endTime ? `– ${item.endTime}` : ''}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Rep:</span>
                        <strong style={{ color: '#0f172a' }}>{item.rep}</strong>
                      </div>
                    </div>

                    {/* Action Links & Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      {item.meetingLink && !isCompleted ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            color: '#ffffff',
                            backgroundColor: '#2563eb',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            textDecoration: 'none'
                          }}
                        >
                          <Video size={13} />
                          <span>Join Google Meet</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : <div />}

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.74rem',
                          color: '#94a3b8',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        title="Remove from schedule"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. ADD ACTIVITY / SCHEDULE MODAL PRE-FILLED WITH SELECTED DATE */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: '#94a3b8',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
              Schedule Activity or Task
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 22px 0' }}>
              Plan a client meeting, demonstration, call, or follow-up task on {formattedSelectedDate}.
            </p>

            <form onSubmit={handleSaveActivity} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Row 1: Activity Type & Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Activity Type *</label>
                  <select
                    value={modalForm.type}
                    onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}
                    className="form-input"
                  >
                    <option value="Meeting">Client Meeting (Google Meet / In-person)</option>
                    <option value="Demo">Product Demonstration</option>
                    <option value="Call">Phone Call</option>
                    <option value="Task">Follow-up Task / To-Do</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Priority Level *</label>
                  <select
                    value={modalForm.priority}
                    onChange={(e) => setModalForm({ ...modalForm, priority: e.target.value })}
                    className="form-input"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Title / Subject */}
              <div>
                <label className="form-label">Title / Agenda Subject *</label>
                <input
                  required
                  placeholder="e.g. Commercial Proposal Review & Payment Terms Discussion"
                  value={modalForm.title}
                  onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Lead Name & Company */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Lead / Contact Person</label>
                  <input
                    placeholder="e.g. Vikram Joshi"
                    value={modalForm.leadName}
                    onChange={(e) => setModalForm({ ...modalForm, leadName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Company Name</label>
                  <input
                    placeholder="e.g. Sahyadri Agro Ltd"
                    value={modalForm.company}
                    onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Date, Start Time & End Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Date *</label>
                  <input
                    required
                    type="date"
                    value={modalForm.date}
                    onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Start Time</label>
                  <input
                    placeholder="10:00 AM"
                    value={modalForm.startTime}
                    onChange={(e) => setModalForm({ ...modalForm, startTime: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">End Time</label>
                  <input
                    placeholder="11:00 AM"
                    value={modalForm.endTime}
                    onChange={(e) => setModalForm({ ...modalForm, endTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Sales Rep & Meeting Link */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Assigned Sales Executive *</label>
                  <select
                    value={modalForm.rep}
                    onChange={(e) => setModalForm({ ...modalForm, rep: e.target.value })}
                    className="form-input"
                  >
                    <option value="Ajay Bhor">Ajay Bhor (Sales Manager)</option>
                    <option value="Sarah Smith">Sarah Smith (Senior Executive)</option>
                    <option value="Suresh Patil">Suresh Patil (Key Account Specialist)</option>
                    <option value="Priya Sharma">Priya Sharma (Corporate Sales Rep)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Meeting URL (Optional)</label>
                  <input
                    placeholder="https://meet.google.com/xyz"
                    value={modalForm.meetingLink}
                    onChange={(e) => setModalForm({ ...modalForm, meetingLink: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Notes / Agenda Description */}
              <div>
                <label className="form-label">Discussion Notes / Brief</label>
                <textarea
                  rows={3}
                  placeholder="Points to discuss, required documents, or target outcomes..."
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontWeight: '700' }}
                >
                  Schedule for {modalForm.date}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
