import React, { useState } from 'react';
import { X, Building, User, IndianRupee, Phone, Mail, Tag, Calendar, UserCheck, AlertCircle, Save } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const AddLeadModal = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = formData.dealValue ? parseFloat(formData.dealValue) : 0;
    await addLead({
      ...formData,
      dealValue: val,
      expectedValue: val,
      createdDate: new Date(formData.leadGenerationDate).toISOString()
    });
    setFormData({
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
    onClose();
  };

  return (
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
        maxWidth: '860px',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: '36px',
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute', 
            top: '22px', 
            right: '22px', 
            color: '#94a3b8',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px'
          }}
        >
          <X size={22} />
        </button>
        
        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
          Capture New Lead Record
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 26px 0' }}>
          Fill in discovery parameters, commercial valuation, and assign to a sales team member.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* TWO COLUMNS: LEFT & RIGHT */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '28px'
          }}>
            {/* LEFT:
                - Lead Name
                - Company
                - Email
                - Phone
                - Source
                - Priority
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Contact & Discovery Details
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Lead Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g. Vikram Joshi" />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Company *</label>
                <input required name="company" value={formData.company} onChange={handleChange} className="form-input" placeholder="e.g. Sahyadri Agro Ltd" />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="vikram@sahyadriagro.in" />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91 98220 45892" />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Lead Source *</label>
                <select name="source" value={formData.source} onChange={handleChange} className="form-input">
                  <option value="Website forms">Website forms</option>
                  <option value="Social media">Social media</option>
                  <option value="Email campaigns">Email campaigns</option>
                  <option value="Phone calls">Phone calls</option>
                  <option value="Partner Referral">Partner Referral</option>
                  <option value="Manual entry">Manual entry</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Priority *</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="form-input">
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* RIGHT:
                - Status
                - Assigned To
                - Expected Value
                - Follow-up Date
                - Lead Generation Date
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pipeline & Assignment Details
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Pipeline Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Assigned Salesperson *</label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="form-input">
                  <option value="Ajay Bhor">Ajay Bhor (Sales Manager)</option>
                  <option value="Sarah Smith">Sarah Smith (Senior Executive)</option>
                  <option value="Suresh Patil">Suresh Patil (Key Account Specialist)</option>
                  <option value="Priya Sharma">Priya Sharma (Corporate Sales Rep)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Expected Value (₹ INR) *</label>
                <input
                  type="number"
                  name="dealValue"
                  value={formData.dealValue}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 750000"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Follow-up Date *</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700' }}>Lead Generation Date *</label>
                <input
                  type="date"
                  name="leadGenerationDate"
                  value={formData.leadGenerationDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* BELOW BOTH COLUMNS: Description [ Large text area ] */}
          <div>
            <label className="form-label" style={{ fontWeight: '700' }}>Description / Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              rows={4}
              placeholder="Enter discovery notes, requirement specifications, or conversation highlights..."
              style={{ minHeight: '110px', resize: 'vertical' }}
            />
          </div>

          {/* THEN: [ Save Lead ] [ Cancel ] */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '14px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '12px 30px', fontSize: '0.96rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={17} />
              <span>Save Lead</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.96rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
