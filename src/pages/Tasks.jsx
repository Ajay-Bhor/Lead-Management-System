import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash2, Calendar, PhoneCall, ListTodo, CheckSquare } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import AddTaskModal from '../components/AddTaskModal';

const Tasks = () => {
  const { tasks, completeTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.isCompleted;
    if (filter === 'Completed') return task.isCompleted;
    return true;
  });

  const getTaskIcon = (type) => {
    switch (type) {
      case 'Meeting': return <Calendar size={18} color="var(--accent-primary)" />;
      case 'Call': return <PhoneCall size={18} color="var(--warning)" />;
      case 'Follow-up': return <ListTodo size={18} color="var(--success)" />;
      default: return <ListTodo size={18} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Task Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track sales activities, meetings, and follow-ups.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex-center" style={{ gap: '8px' }}>
          <Plus size={18} /> Add New Task
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
        {['All', 'Pending', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: filter === tab ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: filter === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tasks found.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: task.isCompleted ? 0.65 : 1,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <button
                  onClick={() => completeTask(task.id)}
                  style={{ color: task.isCompleted ? 'var(--success)' : 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {task.isCompleted ? <CheckCircle size={22} /> : <Circle size={22} />}
                </button>

                <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                  {getTaskIcon(task.type)}
                </div>

                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    marginBottom: '4px'
                  }}>
                    {task.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Type: <strong>{task.type}</strong></span>
                    <span>•</span>
                    <span>Due: <strong>{new Date(task.dueDate).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: task.isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: task.isCompleted ? 'var(--success)' : 'var(--warning)'
                }}>
                  {task.isCompleted ? 'Completed' : 'Pending'}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: '8px', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', border: '1px solid transparent' }}
                  className="hover-bg-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Tasks;
