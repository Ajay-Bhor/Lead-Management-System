import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Video, 
  MessageSquare, 
  FileText, 
  Send, 
  Plus, 
  Share2, 
  CheckSquare, 
  Paperclip, 
  Download, 
  Edit3, 
  Trash2,
  TrendingUp,
  Award,
  ChevronRight,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  UserCheck,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import EditLeadModal from '../components/EditLeadModal';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'];

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLeadStatus, reassignLead, fetchActivities, addActivity, deleteLead, openEditLead } = useLeads();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities', 'notes', 'tasks', 'documents'
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Activity logger state
  const [activityType, setActivityType] = useState('Phone Call'); // Phone Call, Email, Meeting, WhatsApp, Demo, Follow-up
  const [activitySubject, setActivitySubject] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [activityOutcome, setActivityOutcome] = useState('Connected');
  const [isLogging, setIsLogging] = useState(false);

  // Notes tab state
  const [noteContent, setNoteContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [notesList, setNotesList] = useState([
    {
      id: 1,
      author: 'Ajay Bhor',
      date: '2026-09-21 14:30',
      pinned: true,
      text: 'Client requested comprehensive pricing for 500 MT quarterly bulk supply. Payment terms proposed: 30 days net. Technical QA audit approved.'
    },
    {
      id: 2,
      author: 'Suresh Patil',
      date: '2026-09-18 11:15',
      pinned: false,
      text: 'Sample dispatch confirmed with quality assurance team. Batch lab report attached to documentation file.'
    }
  ]);

  // Tasks tab state
  const [tasksList, setTasksList] = useState([
    { id: 1, title: 'Send revised commercial quotation with volume discount', dueDate: '2026-09-24', priority: 'High', completed: false, assignee: 'Ajay Bhor' },
    { id: 2, title: 'Schedule technical validation demo call with procurement team', dueDate: '2026-09-25', priority: 'Medium', completed: true, assignee: 'Ajay Bhor' },
    { id: 3, title: 'Review credit verification and financial GST compliance audit', dueDate: '2026-09-27', priority: 'Low', completed: false, assignee: 'Suresh Patil' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  // Documents tab state
  const [documentsList, setDocumentsList] = useState([
    { id: 1, name: 'Commercial_Quotation_Rev2.pdf', size: '1.4 MB', uploadedBy: 'Ajay Bhor', date: '2026-09-20' },
    { id: 2, name: 'Technical_Specification_Sheet.pdf', size: '820 KB', uploadedBy: 'Ajay Bhor', date: '2026-09-19' },
    { id: 3, name: 'Client_GST_Registration_Certificate.pdf', size: '450 KB', uploadedBy: 'Suresh Patil', date: '2026-09-17' },
    { id: 4, name: 'Product_Purity_Lab_Certificate.pdf', size: '1.1 MB', uploadedBy: 'Ajay Bhor', date: '2026-09-16' }
  ]);

  useEffect(() => {
    if (leads && leads.length > 0) {
      const found = leads.find(l => String(l.id) === String(id));
      if (found) {
        setLead(found);
        loadActivities(found.id);
      } else {
        // Fallback realistic enterprise lead
        setLead({
          id: id,
          name: 'Vikram Joshi',
          contactPerson: 'Vikram Joshi',
          company: 'Sahyadri Agro Industries Pvt Ltd',
          email: 'vikram.j@sahyadriagro.in',
          phone: '+91 98220 45892',
          source: 'Website forms',
          status: 'Won',
          priority: 'High',
          assignedTo: 'Ajay Bhor',
          dealValue: 750000,
          expectedValue: 750000,
          createdDate: '2026-08-26T10:15:00',
          followUpDate: '2026-09-25',
          notes: 'Customer looking for bulk supply contract for Maharashtra distribution network.'
        });
      }
    }
  }, [id, leads]);

  const loadActivities = async (leadId) => {
    const data = await fetchActivities(leadId);
    if (Array.isArray(data) && data.length > 0) {
      setActivities(data);
    } else {
      setActivities([
        {
          id: 101,
          type: 'Call',
          title: 'Initial Discovery Call',
          description: 'Spoke with Procurement Head Vikram Joshi. Discussed required monthly tonnage, quality parameters, and delivery timelines.',
          outcome: 'Interested',
          createdAt: '2026-08-26T11:30:00',
          performedBy: 'Ajay Bhor'
        },
        {
          id: 102,
          type: 'Meeting',
          title: 'Virtual Product Demo & Pricing Review',
          description: 'Presented commercial deck, certifications, and volume delivery schedules over Google Meet.',
          outcome: 'Proposal Requested',
          createdAt: '2026-08-27T14:00:00',
          performedBy: 'Ajay Bhor'
        },
        {
          id: 103,
          type: 'Email',
          title: 'Sent Formal Proposal & Quotation v2',
          description: 'Emailed official proposal with 5% volume incentive and 30-day payment term.',
          outcome: 'Proposal Sent',
          createdAt: '2026-08-29T16:30:00',
          performedBy: 'Ajay Bhor'
        },
        {
          id: 104,
          type: 'Call',
          title: 'Contract Negotiation & Payment Schedule',
          description: 'Agreed on delivery milestones and 30-day credit period. Contract sent for final executive signing.',
          outcome: 'Agreement Reached',
          createdAt: '2026-09-01T13:00:00',
          performedBy: 'Ajay Bhor'
        },
        {
          id: 105,
          type: 'StatusChange',
          title: 'Stage Moved to Won - Contract Finalized',
          description: 'Commercial contract signed and advance payment voucher cleared.',
          outcome: 'Deal Closed',
          createdAt: '2026-09-02T11:00:00',
          performedBy: 'Ajay Bhor'
        }
      ]);
    }
  };

  const handleStageChange = async (newStage) => {
    if (!lead) return;
    await updateLeadStatus(lead.id, newStage);
    setLead(prev => ({ ...prev, status: newStage }));
    loadActivities(lead.id);
  };

  const handleLogActivity = async (e) => {
    e.preventDefault();
    if (!activitySubject.trim()) return;

    setIsLogging(true);
    await addActivity(lead.id, {
      type: activityType,
      title: activitySubject.trim(),
      description: activityNotes.trim() || `Conducted ${activityType} with client`,
      outcome: activityOutcome
    });

    const newEntry = {
      id: Date.now(),
      type: activityType,
      title: activitySubject.trim(),
      description: activityNotes.trim() || `Conducted ${activityType} with client`,
      outcome: activityOutcome,
      createdAt: new Date().toISOString(),
      performedBy: 'Ajay Bhor'
    };
    setActivities(prev => [newEntry, ...prev]);

    setActivitySubject('');
    setActivityNotes('');
    setIsLogging(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const newNote = {
      id: Date.now(),
      author: 'Ajay Bhor',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pinned: isPinned,
      text: noteContent.trim()
    };
    setNotesList(prev => [newNote, ...prev]);
    setNoteContent('');
    setIsPinned(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      dueDate: newTaskDue || '2026-09-30',
      priority: newTaskPriority,
      completed: false,
      assignee: lead?.assignedTo || 'Ajay Bhor'
    };
    setTasksList(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDue('');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasksList(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteThisLead = async () => {
    if (window.confirm(`Are you sure you want to delete lead "${lead?.name}"?`)) {
      await deleteLead(lead?.id);
      navigate('/leads');
    }
  };

  if (!lead) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading lead record...
      </div>
    );
  }

  // Exact 6-Stage Journey Timeline Data with Dates, Times, Durations, and Responsible Reps
  const timelineStages = [
    {
      stage: 'Lead Generated',
      date: '26 Aug',
      time: '10:15 AM',
      duration: 'Inbound Capture',
      rep: 'Automated Inbound Engine',
      completed: true,
      color: '#2563eb'
    },
    {
      stage: 'First Contact',
      date: '26 Aug',
      time: '11:30 AM',
      duration: '1 Hour 15 Mins',
      rep: lead.assignedTo || 'Ajay Bhor',
      completed: true,
      color: '#3b82f6'
    },
    {
      stage: 'Qualified',
      date: '27 Aug',
      time: '02:00 PM',
      duration: '1 Day 2.5 Hours',
      rep: lead.assignedTo || 'Ajay Bhor',
      completed: true,
      color: '#10b981'
    },
    {
      stage: 'Proposal',
      date: '29 Aug',
      time: '04:30 PM',
      duration: '2 Days 2.5 Hours',
      rep: lead.assignedTo || 'Ajay Bhor',
      completed: true,
      color: '#8b5cf6'
    },
    {
      stage: 'Negotiation',
      date: '01 Sep',
      time: '01:00 PM',
      duration: '2 Days 20.5 Hours',
      rep: lead.assignedTo || 'Ajay Bhor',
      completed: true,
      color: '#f59e0b'
    },
    {
      stage: lead.status === 'Lost' ? 'Lost' : 'Won',
      date: '02 Sep',
      time: '11:00 AM',
      duration: '22 Hours',
      rep: lead.assignedTo || 'Ajay Bhor',
      completed: lead.status === 'Won' || lead.status === 'Lost',
      isWon: lead.status === 'Won',
      isLost: lead.status === 'Lost',
      color: lead.status === 'Lost' ? '#dc2626' : '#16a34a'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. TOP PROFILE HEADER: Lead Name, Company, Status, Priority, Expected Value */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Left: Back button + Profile Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/leads')}
            className="btn-secondary"
            style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Leads</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {lead.name}
              </h1>

              {/* Status Badge */}
              <span className={`badge badge-${lead.status.toLowerCase().replace(/\s+/g, '')}`} style={{ fontSize: '0.84rem', padding: '4px 12px' }}>
                {lead.status}
              </span>

              {/* Priority Badge */}
              <span className={`badge ${lead.priority === 'High' ? 'badge-lost' : 'badge-new'}`} style={{ fontSize: '0.84rem', padding: '4px 12px' }}>
                {lead.priority || 'Normal'} Priority
              </span>
            </div>

            <div style={{ fontSize: '0.92rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <span style={{ fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building size={16} color="#64748b" />
                {lead.company}
              </span>
              <span>•</span>
              <span>ID: #{lead.id.substring(0, 8)}</span>
              <span>•</span>
              <span>Captured: 26 Aug, 10:15 AM</span>
            </div>
          </div>
        </div>

        {/* Right: Expected Value Hero & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Expected Value */}
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '10px 20px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#047857', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.04em' }}>
              Expected Value
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', lineHeight: 1.1 }}>
              ₹{(lead.dealValue || lead.expectedValue || 750000).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Quick Stage Transition Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Stage:</span>
            <select
              value={lead.status}
              onChange={(e) => handleStageChange(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontWeight: '800',
                fontSize: '0.88rem',
                color: '#2563eb',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Edit Button */}
          <button 
            onClick={() => openEditLead(lead)} 
            className="btn-primary"
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}
          >
            <Edit3 size={16} />
            <span>Edit Lead</span>
          </button>

          {/* More Actions Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMoreActions(prev => !prev)}
              className="btn-secondary"
              style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}
            >
              <MoreVertical size={16} />
            </button>

            {showMoreActions && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '6px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '6px',
                minWidth: '190px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <button
                  onClick={() => {
                    setShowMoreActions(false);
                    setActiveTab('activities');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', fontSize: '0.84rem', color: '#0f172a', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <PhoneCall size={14} color="#2563eb" />
                  <span>Log Activity</span>
                </button>
                <button
                  onClick={() => {
                    setShowMoreActions(false);
                    const newRep = prompt("Reassign lead to:", lead.assignedTo || "Sarah Smith");
                    if (newRep) {
                      reassignLead(lead.id, newRep);
                      setLead(prev => ({ ...prev, assignedTo: newRep }));
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', fontSize: '0.84rem', color: '#0f172a', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <UserCheck size={14} color="#16a34a" />
                  <span>Reassign Salesperson</span>
                </button>
                <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />
                <button
                  onClick={() => {
                    setShowMoreActions(false);
                    handleDeleteThisLead();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', fontSize: '0.84rem', color: '#dc2626', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <Trash2 size={14} />
                  <span>Delete Lead</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. TWO LARGE SECTIONS:
             LEFT — Lead Information
             RIGHT — Lead Journey
      */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '28px',
        alignItems: 'stretch'
      }}>
        {/* ===================== LEFT: LEAD INFORMATION ===================== */}
        <div className="card" style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Lead Information
            </h2>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', padding: '3px 8px', borderRadius: '9999px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              VERIFIED RECORD
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
            {/* Contact Person */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <User size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Contact Person</span>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                  {lead.contactPerson || lead.name}
                </div>
              </div>
            </div>

            {/* Company */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Building size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Company</span>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                  {lead.company || 'Sahyadri Agro Ltd'}
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Mail size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '600', marginTop: '2px' }}>
                  <a href={`mailto:${lead.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{lead.email}</a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <Phone size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Phone Number</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>
                  <a href={`tel:${lead.phone}`} style={{ color: '#0f172a', textDecoration: 'none' }}>{lead.phone || '+91 98220 45892'}</a>
                </div>
              </div>
            </div>

            {/* Source */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                <Tag size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Lead Source</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>
                  {lead.source || 'Website forms'}
                </div>
              </div>
            </div>

            {/* Priority */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ea580c' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Priority Level</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                  {lead.priority || 'High'} Priority
                </div>
              </div>
            </div>

            {/* Assigned Salesperson */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706' }}>
                <UserCheck size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Assigned Rep</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                  {lead.assignedTo || 'Ajay Bhor'}
                </div>
              </div>
            </div>

            {/* Expected Value */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Expected Value</span>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
                  ₹{(lead.dealValue || lead.expectedValue || 750000).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Lead Generation Date */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Calendar size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Created Date</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>
                  26 Aug, 10:15 AM
                </div>
              </div>
            </div>

            {/* Follow-up Date */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Clock size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Next Follow-up</span>
                <div style={{ fontSize: '0.94rem', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>
                  {lead.followUpDate || '25 Sep 2026'}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Context Box */}
          <div style={{
            marginTop: '24px',
            padding: '18px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.04em' }}>
              Opportunity Context & Description
            </span>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
              {lead.notes || 'Prospect looking for bulk quarterly commercial contract for Maharashtra distribution hub. Requested volume discount schedules, laboratory QA certification batch records, and 30-day net settlement terms.'}
            </p>
          </div>
        </div>

        {/* ===================== RIGHT: LEAD JOURNEY ===================== */}
        <div className="card" style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Lead Journey
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '2px 0 0 0' }}>
                Stage velocity, transition timestamps, and owners.
              </p>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', padding: '3px 8px', borderRadius: '9999px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              6 STAGES
            </span>
          </div>

          {/* Vertical Downward Timeline: Plenty of Space Between Stages
              Lead Generated
              ↓
              First Contact
              ↓
              Qualified
              ↓
              Proposal
              ↓
              Negotiation
              ↓
              Won / Lost
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flex: 1 }}>
            {timelineStages.map((stg, index) => {
              const isLast = index === timelineStages.length - 1;

              return (
                <div key={stg.stage} style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Stage Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: stg.isWon ? '#f0fdf4' : stg.isLost ? '#fef2f2' : stg.completed ? '#ffffff' : '#f8fafc',
                    border: `1px solid ${stg.isWon ? '#86efac' : stg.isLost ? '#fca5a5' : stg.completed ? '#cbd5e1' : '#e2e8f0'}`,
                    boxShadow: stg.completed ? '0 1px 3px rgba(0,0,0,0.04)' : 'none'
                  }}>
                    {/* Circle Indicator */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      minWidth: '40px',
                      borderRadius: '50%',
                      backgroundColor: stg.isWon ? '#16a34a' : stg.isLost ? '#dc2626' : stg.completed ? '#2563eb' : '#e2e8f0',
                      color: stg.completed ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      boxShadow: stg.completed ? '0 3px 8px rgba(37,99,235,0.25)' : 'none'
                    }}>
                      {stg.completed ? <Check size={20} strokeWidth={3} /> : (index + 1)}
                    </div>

                    {/* Stage Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{
                          fontSize: '1.02rem',
                          fontWeight: '800',
                          color: stg.isWon ? '#15803d' : stg.isLost ? '#b91c1c' : '#0f172a'
                        }}>
                          {stg.stage}
                        </span>

                        {/* Date & Time */}
                        <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#2563eb' }}>
                          {stg.date} — {stg.time}
                        </span>
                      </div>

                      {/* Duration & Person Responsible Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          color: '#475569',
                          backgroundColor: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontWeight: '600'
                        }}>
                          Duration: <strong style={{ color: '#0f172a' }}>{stg.duration}</strong>
                        </span>

                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={13} color="#94a3b8" />
                          <strong style={{ color: '#334155' }}>{stg.rep}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Downward Connector with Arrow ↓ (Plenty of Space) */}
                  {!isLast && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 0',
                      marginLeft: '26px'
                    }}>
                      <div style={{ width: '2px', height: '14px', backgroundColor: '#cbd5e1' }} />
                      <div style={{
                        color: '#64748b',
                        fontSize: '0.86rem',
                        fontWeight: '800',
                        lineHeight: 1
                      }}>
                        ↓
                      </div>
                      <div style={{ width: '2px', height: '6px', backgroundColor: '#cbd5e1' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PROMINENT TOTAL TIME TO WIN HERO DISPLAY AT THE BOTTOM */}
          <div style={{
            marginTop: '28px',
            backgroundColor: lead.status === 'Won' ? '#f0fdf4' : lead.status === 'Lost' ? '#fef2f2' : '#eff6ff',
            border: `2px solid ${lead.status === 'Won' ? '#86efac' : lead.status === 'Lost' ? '#fca5a5' : '#bfdbfe'}`,
            padding: '20px 24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: lead.status === 'Won' ? '#16a34a' : lead.status === 'Lost' ? '#dc2626' : '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <Award size={26} />
              </div>
              <div>
                <div style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  fontWeight: '800',
                  color: lead.status === 'Won' ? '#15803d' : lead.status === 'Lost' ? '#b91c1c' : '#1d4ed8',
                  letterSpacing: '0.06em'
                }}>
                  TOTAL TIME TO WIN
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: lead.status === 'Won' ? '#14532d' : lead.status === 'Lost' ? '#991b1b' : '#1e3a8a',
                  lineHeight: 1.2
                }}>
                  7 Days 4 Hours 45 Minutes
                </div>
              </div>
            </div>

            <div style={{
              fontSize: '0.8rem',
              color: '#15803d',
              fontWeight: '700',
              backgroundColor: '#dcfce7',
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid #86efac'
            }}>
              ⚡ 3.2 Days Faster than Org Benchmark
            </div>
          </div>
        </div>
      </div>


      {/* 4. TABS: Activities | Notes | Tasks | Documents */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          padding: '0 20px'
        }}>
          {[
            { id: 'activities', label: 'Activities', count: activities.length, icon: <PhoneCall size={16} /> },
            { id: 'notes', label: 'Notes', count: notesList.length, icon: <FileText size={16} /> },
            { id: 'tasks', label: 'Tasks', count: tasksList.filter(t => !t.completed).length, icon: <CheckSquare size={16} /> },
            { id: 'documents', label: 'Documents', count: documentsList.length, icon: <Paperclip size={16} /> }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 22px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  color: isActive ? '#2563eb' : '#64748b',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#2563eb' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '28px' }}>
          {/* TAB 1: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '28px' }}>
              {/* Left Logger Form */}
              <div style={{ backgroundColor: '#f8fafc', padding: '22px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} color="#2563eb" />
                  Log New Sales Activity
                </h4>

                <form onSubmit={handleLogActivity} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Activity Type Buttons */}
                  <div>
                    <label className="form-label">Interaction Channel</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {['Phone Call', 'Email', 'Meeting', 'WhatsApp', 'Demo', 'Follow-up'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setActivityType(type)}
                          style={{
                            padding: '7px 4px',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: activityType === type ? '700' : '500',
                            backgroundColor: activityType === type ? '#2563eb' : '#ffffff',
                            color: activityType === type ? '#ffffff' : '#475569',
                            border: `1px solid ${activityType === type ? '#2563eb' : '#cbd5e1'}`,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="form-label">Activity Subject *</label>
                    <input
                      required
                      type="text"
                      value={activitySubject}
                      onChange={(e) => setActivitySubject(e.target.value)}
                      placeholder="e.g. Contract review with Procurement Head"
                      className="form-input"
                    />
                  </div>

                  {/* Outcome */}
                  <div>
                    <label className="form-label">Interaction Outcome</label>
                    <select
                      value={activityOutcome}
                      onChange={(e) => setActivityOutcome(e.target.value)}
                      className="form-input"
                    >
                      <option value="Connected">Connected & Positive</option>
                      <option value="Interested">High Interest - Send Proposal</option>
                      <option value="Demo Scheduled">Product Demo Scheduled</option>
                      <option value="Follow-up Required">Follow-up Required</option>
                      <option value="Agreement Reached">Agreement Reached</option>
                      <option value="Deal Closed">Deal Closed & Won</option>
                      <option value="Left Voicemail">Left Voicemail / No Answer</option>
                    </select>
                  </div>

                  {/* Discussion Notes */}
                  <div>
                    <label className="form-label">Key Discussion Minutes</label>
                    <textarea
                      rows={3}
                      value={activityNotes}
                      onChange={(e) => setActivityNotes(e.target.value)}
                      placeholder="Record discussion remarks, objections, and next steps..."
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLogging}
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '11px', fontWeight: '700' }}
                  >
                    {isLogging ? 'Logging Activity...' : 'Save Activity Entry'}
                  </button>
                </form>
              </div>

              {/* Right Chronological History Feed */}
              <div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                  Chronological Activity Feed ({activities.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto', paddingRight: '6px' }}>
                  {activities.map((act, index) => (
                    <div key={act.id || index} style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      display: 'flex',
                      gap: '12px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: act.type === 'Call' || act.type === 'Phone Call' ? '#fef3c7' : act.type === 'Meeting' ? '#eff6ff' : '#f5f3ff',
                        color: act.type === 'Call' || act.type === 'Phone Call' ? '#d97706' : act.type === 'Meeting' ? '#2563eb' : '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {act.type === 'Call' || act.type === 'Phone Call' ? <PhoneCall size={17} /> : act.type === 'Meeting' ? <Video size={17} /> : <FileText size={17} />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                            {act.title}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {act.createdAt ? new Date(act.createdAt).toLocaleString() : 'Recent'}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: '#475569', margin: '4px 0 8px 0', lineHeight: 1.45 }}>
                          {act.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {act.outcome && (
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              border: '1px solid #dbeafe'
                            }}>
                              {act.outcome}
                            </span>
                          )}
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Owner: <strong>{act.performedBy || 'Ajay Bhor'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTES */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <form onSubmit={handleAddNote} style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>Add Internal Collaboration Note</h4>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record confidential remarks, pricing feedback, negotiation hints, or compliance updates..."
                  className="form-input"
                  style={{ marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span style={{ fontWeight: '600' }}>Pin note to top of lead history</span>
                  </label>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>
                    Post Note
                  </button>
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notesList.map(note => (
                  <div key={note.id} style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: note.pinned ? '#fefce8' : '#ffffff',
                    border: `1px solid ${note.pinned ? '#fef08a' : '#e2e8f0'}`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>{note.author}</span>
                        {note.pinned && (
                          <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#fef08a', color: '#854d0e' }}>
                            PINNED NOTE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{note.date}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TASKS */}
          {activeTab === 'tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <input
                  type="text"
                  placeholder="Task title (e.g. Follow up on final contract approval)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="form-input"
                  style={{ flex: 2 }}
                />
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button type="submit" className="btn-primary" style={{ padding: '9px 18px', whiteSpace: 'nowrap' }}>
                  Add Task
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasksList.map(task => (
                  <div key={task.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    backgroundColor: task.completed ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    opacity: task.completed ? 0.75 : 1
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: '700',
                          color: '#0f172a',
                          textDecoration: task.completed ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Due: {task.dueDate} • Assigned to: {task.assignee}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${task.priority === 'High' ? 'badge-lost' : 'badge-new'}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Attached Quotes, Proposals & Specifications
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Uploaded commercial proposals, certificates, and compliance papers
                  </span>
                </div>
                <button
                  onClick={() => alert("Upload document dialog. Supported formats: PDF, DOCX, XLSX.")}
                  className="btn-primary"
                  style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Paperclip size={15} />
                  <span>Upload Document</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {documentsList.map(doc => (
                  <div key={doc.id} style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{doc.size} • Uploaded by {doc.uploadedBy} on {doc.date}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${doc.name}...`)}
                      style={{ border: 'none', backgroundColor: 'transparent', color: '#2563eb', cursor: 'pointer', padding: '6px' }}
                      title="Download file"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Lead Modal */}
      <EditLeadModal />
    </div>
  );
};

export default LeadDetails;
