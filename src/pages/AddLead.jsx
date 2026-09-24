import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  FileText,
  Save,
  X
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const AddLead = () => {
  const navigate = useNavigate();
  const { addLead } = useLeads();

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website forms',
    priority: 'Medium',
    status: 'New',
    assignedTo: 'Ajay Bhor',
    dealValue: '',
    followUpDate: nextWeekStr,
    leadGenerationDate: todayStr,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const val = formData.dealValue ? parseFloat(formData.dealValue) : 0;
      await addLead({
        ...formData,
        dealValue: val,
        expectedValue: val,
        createdDate: new Date(formData.leadGenerationDate).toISOString()
      });
      setSuccessMessage('Lead captured successfully! Redirecting...');
      setTimeout(() => {
        navigate('/leads');
      }, 700);
    } catch (err) {
      console.error('Failed to create lead', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%'
    }}>
      {/* 1. TOP HEADER & BACK NAVIGATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/leads')}
            className="btn-secondary"
            style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Leads</span>
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Add New Enterprise Lead
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '3px' }}>
              Create a prospect record with contact details, commercial expectations, and team ownership.
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#15803d',
          padding: '14px 20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '700'
        }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. SPACIOUS TWO-COLUMN FORM CONTAINER */}
      <div className="card" style={{ padding: '36px 44px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* TWO COLUMNS: LEFT & RIGHT */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '36px'
          }}>
            {/* LEFT COLUMN:
                - Lead Name
                - Company
                - Email
                - Phone
                - Source
                - Priority
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{
                fontSize: '0.94rem',
                fontWeight: '800',
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingBottom: '8px',
                borderBottom: '2px solid #eff6ff'
              }}>
                1. Contact & Discovery Information
              </div>

              {/* Lead Name */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Lead Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Vikram Joshi"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Company Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Sahyadri Agro Industries Ltd"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. vikram.j@sahyadriagro.in"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Phone Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. +91 98220 45892"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Lead Source *
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="form-input"
                  style={{ height: '48px', fontSize: '0.95rem' }}
                >
                  <option value="Website forms">Website forms (Inbound Web)</option>
                  <option value="Social media">Social media (LinkedIn / Campaigns)</option>
                  <option value="Email campaigns">Email campaigns (Newsletter)</option>
                  <option value="Phone calls">Phone calls (Direct Line)</option>
                  <option value="Partner Referral">Partner Referral</option>
                  <option value="Manual entry">Manual Direct Sourcing</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Priority Level *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-input"
                  style={{ height: '48px', fontSize: '0.95rem' }}
                >
                  <option value="High">High Priority (Urgent Requirement)</option>
                  <option value="Medium">Medium Priority (Standard Velocity)</option>
                  <option value="Low">Low Priority (Nurturing / Early Discovery)</option>
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN:
                - Status
                - Assigned To
                - Expected Value
                - Follow-up Date
                - Lead Generation Date
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{
                fontSize: '0.94rem',
                fontWeight: '800',
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingBottom: '8px',
                borderBottom: '2px solid #eff6ff'
              }}>
                2. Pipeline & Commercial Parameters
              </div>

              {/* Status */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Initial Pipeline Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                  style={{ height: '48px', fontSize: '0.95rem' }}
                >
                  <option value="New">New (Captured)</option>
                  <option value="Contacted">Contacted (First Touch)</option>
                  <option value="Qualified">Qualified (Budget & Authority Verified)</option>
                  <option value="Proposal">Proposal (Commercial Terms Submitted)</option>
                  <option value="Negotiation">Negotiation (Final Review)</option>
                  <option value="Won">Won (Closed Deal)</option>
                  <option value="Lost">Lost (Disqualified / Closed Lost)</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Assigned Sales Executive *
                </label>
                <div style={{ position: 'relative' }}>
                  <UserCheck size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  >
                    <option value="Ajay Bhor">Ajay Bhor (Sales Manager)</option>
                    <option value="Sarah Smith">Sarah Smith (Senior Executive)</option>
                    <option value="Suresh Patil">Suresh Patil (Key Account Specialist)</option>
                    <option value="Priya Sharma">Priya Sharma (Corporate Sales Rep)</option>
                  </select>
                </div>
              </div>

              {/* Expected Value */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Expected Value (₹ INR) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#64748b' }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    name="dealValue"
                    value={formData.dealValue}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 750000"
                    style={{ paddingLeft: '38px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Follow-up Date *
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Lead Generation Date */}
              <div>
                <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
                  Lead Generation Date *
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="date"
                    name="leadGenerationDate"
                    value={formData.leadGenerationDate}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BELOW BOTH COLUMNS: Large Description Textarea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              fontSize: '0.94rem',
              fontWeight: '800',
              color: '#2563eb',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              paddingBottom: '8px',
              borderBottom: '2px solid #eff6ff'
            }}>
              3. Description & Initial Opportunity Context
            </div>
            <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700' }}>
              Description
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              rows={5}
              placeholder="Enter comprehensive discovery details, requested product specs, delivery volumes, credit period requests, or conversation summary..."
              style={{
                minHeight: '140px',
                padding: '16px',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
            />
          </div>

          {/* THEN: [ Save Lead ] [ Cancel ] */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                padding: '14px 36px',
                fontSize: '1rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Saving Lead...' : 'Save Lead'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="btn-secondary"
              style={{
                padding: '14px 28px',
                fontSize: '0.98rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
