import React, { useState, useEffect } from 'react';
import { X, Save, Building, User, IndianRupee, Phone, Mail, Tag, Calendar, UserCheck } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const EditLeadModal = () => {
  const { editingLead, isEditModalOpen, closeEditLead, updateLead } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website forms',
    status: 'New',
    priority: 'Medium',
    assignedTo: 'Ajay Bhor',
    dealValue: '',
    followUpDate: '',
    notes: ''
  });

  useEffect(() => {
    if (editingLead) {
      setFormData({
        name: editingLead.name || '',
        company: editingLead.company || '',
        email: editingLead.email || '',
        phone: editingLead.phone || '',
        source: editingLead.source || 'Website forms',
        status: editingLead.status || 'New',
        priority: editingLead.priority || 'Medium',
        assignedTo: editingLead.assignedTo || 'Ajay Bhor',
        dealValue: editingLead.dealValue || editingLead.expectedValue || '',
        followUpDate: editingLead.followUpDate || '',
        notes: editingLead.notes || ''
      });
    }
  }, [editingLead]);

  if (!isEditModalOpen || !editingLead) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateLead(editingLead.id, {
      ...editingLead,
      ...formData,
      dealValue: formData.dealValue ? parseFloat(formData.dealValue) : 0,
      expectedValue: formData.dealValue ? parseFloat(formData.dealValue) : 0
    });
    closeEditLead();
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
      zIndex: 1150,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        <button 
          onClick={closeEditLead} 
          style={{
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            color: '#94a3b8',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px'
          }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
          Update Lead Details
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0 0 22px 0' }}>
          Modify customer contact info, deal valuation, pipeline stage, and assignment.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: Lead Name & Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Lead / Contact Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Company Name *</label>
              <input required name="company" value={formData.company} onChange={handleChange} className="form-input" />
            </div>
          </div>
          
          {/* Row 2: Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
            </div>
          </div>

          {/* Row 3: Source, Status, Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Lead Source *</label>
              <select name="source" value={formData.source} onChange={handleChange} className="form-input">
                <option value="Website forms">Website forms</option>
                <option value="Social media">Social media</option>
                <option value="Email campaigns">Email campaigns</option>
                <option value="Phone calls">Phone calls</option>
                <option value="Manual entry">Manual entry</option>
              </select>
            </div>
            <div>
              <label className="form-label">Pipeline Stage *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="form-label">Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="form-input">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Row 4: Assigned To, Deal Value, Follow-up Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Assigned Rep *</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="form-input">
                <option value="Ajay Bhor">Ajay Bhor</option>
                <option value="Sarah Smith">Sarah Smith</option>
                <option value="Suresh Patil">Suresh Patil</option>
                <option value="Priya Sharma">Priya Sharma</option>
                <option value="Auto Round-Robin">Auto Round-Robin</option>
              </select>
            </div>
            <div>
              <label className="form-label">Expected Value (₹)</label>
              <input type="number" name="dealValue" value={formData.dealValue} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Follow-up Date</label>
              <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className="form-input" />
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="form-label">Requirements / Internal Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              className="form-input" 
              rows={3} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={closeEditLead} className="btn-secondary" style={{ padding: '9px 18px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '9px 24px' }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
