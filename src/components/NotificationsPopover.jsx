import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, Calendar, PhoneCall, ListTodo, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

const NotificationsPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { reminders, completeTask } = useTasks();
  const popoverRef = useRef(null);

  const safeReminders = Array.isArray(reminders) ? reminders : [];
  const unreadCount = safeReminders.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUrgencyBadge = (reminder) => {
    if (reminder.isOverdue) {
      return {
        text: 'Overdue',
        bg: 'rgba(220, 38, 38, 0.1)',
        color: 'var(--danger)',
        icon: <AlertTriangle size={12} />
      };
    }
    if (reminder.isDueToday) {
      return {
        text: 'Due Today',
        bg: 'rgba(217, 119, 6, 0.12)',
        color: 'var(--warning)',
        icon: <Clock size={12} />
      };
    }
    return {
      text: 'Upcoming',
      bg: 'rgba(37, 99, 235, 0.1)',
      color: 'var(--accent-primary)',
      icon: <Calendar size={12} />
    };
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'Meeting': return <Calendar size={15} color="var(--accent-primary)" />;
      case 'Call': return <PhoneCall size={15} color="var(--warning)" />;
      case 'Follow-up': return <ListTodo size={15} color="var(--success)" />;
      default: return <ListTodo size={15} />;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Reminders & Notifications"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: isOpen ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          color: isOpen ? '#ffffff' : 'var(--text-secondary)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            backgroundColor: 'var(--danger)',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: '700',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-secondary)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'absolute',
          top: '46px',
          right: '0',
          width: '360px',
          maxHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-tertiary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Reminders & Alerts</span>
              <span style={{
                backgroundColor: unreadCount > 0 ? 'var(--danger)' : 'var(--bg-secondary)',
                color: unreadCount > 0 ? '#fff' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {unreadCount}
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
            {safeReminders.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 8px', opacity: 0.8 }} />
                <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>All caught up!</p>
                <span style={{ fontSize: '0.78rem' }}>No pending alerts or overdue tasks.</span>
              </div>
            ) : (
              safeReminders.map(item => {
                const badge = getUrgencyBadge(item);
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-light)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex' }}>
                      {getTaskIcon(item.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}>
                          {badge.icon}
                          {badge.text}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.type}
                        </span>
                      </div>
                      <h4 style={{
                        fontSize: '0.86rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                        lineHeight: 1.3
                      }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <button
                      onClick={() => completeTask(item.id)}
                      title="Mark as completed"
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        marginTop: '4px'
                      }}
                      className="hover-success"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-secondary)',
            textAlign: 'center'
          }}>
            <Link
              to="/tasks"
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '0.82rem',
                fontWeight: '600',
                color: 'var(--accent-primary)',
                textDecoration: 'none'
              }}
            >
              View All Tasks & Schedule →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
