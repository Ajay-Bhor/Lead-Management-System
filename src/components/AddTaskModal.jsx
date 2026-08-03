import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const AddTaskModal = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Call',
    dueDate: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    });
    setFormData({
      title: '',
      type: 'Call',
      dueDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 17, 21, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '32px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)'
        }}>
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Create New Task</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Task Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="Follow up with client regarding proposal..." />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Task Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Due Date</label>
              <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: 'var(--text-secondary)',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-tertiary)',
  color: 'var(--text-primary)',
  outline: 'none',
  fontSize: '0.95rem'
};

export default AddTaskModal;
