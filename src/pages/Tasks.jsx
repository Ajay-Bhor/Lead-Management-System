import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  PhoneCall, 
  ListTodo, 
  Clock, 
  AlertCircle,
  Filter,
  Users,
  CheckSquare,
  Search
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useLeads } from '../context/LeadContext';
import AddTaskModal from '../components/AddTaskModal';

const Tasks = () => {
  const { tasks, completeTask, deleteTask } = useTasks();
  const { currentUser } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my'); // 'my', 'team', 'overdue', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const currentUserName = currentUser?.name || 'Ajay Bhor';

  const todayStr = new Date().toISOString().split('T')[0];

  // Tab filtering
  const filteredTasks = safeTasks.filter(task => {
    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match = (task.title || '').toLowerCase().includes(term) || (task.leadName || '').toLowerCase().includes(term);
      if (!match) return false;
    }

    const dueStr = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    const isOverdue = !task.isCompleted && dueStr && dueStr < todayStr;

    switch (activeTab) {
      case 'my':
        return !task.isCompleted && (task.assignedTo === currentUserName || task.assignedTo === 'Ajay Bhor' || !task.assignedTo);
      case 'team':
        return !task.isCompleted;
      case 'overdue':
        return isOverdue;
      case 'completed':
        return task.isCompleted;
      default:
        return true;
    }
  });

  // Tab count badges
  const myTasksCount = safeTasks.filter(t => !t.isCompleted && (t.assignedTo === currentUserName || t.assignedTo === 'Ajay Bhor' || !t.assignedTo)).length;
  const teamTasksCount = safeTasks.filter(t => !t.isCompleted).length;
  const overdueCount = safeTasks.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate).toISOString().split('T')[0] < todayStr).length;
  const completedCount = safeTasks.filter(t => t.isCompleted).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Tasks & Follow-up Agenda
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
            Coordinate sales calls, client discovery meetings, and deal closing milestones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
        >
          <Plus size={16} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* 4 Tabs Header */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 16px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex' }}>
            {[
              { id: 'my', label: 'My Tasks', count: myTasksCount },
              { id: 'team', label: 'Team Tasks', count: teamTasksCount },
              { id: 'overdue', label: 'Overdue', count: overdueCount, isDanger: overdueCount > 0 },
              { id: 'completed', label: 'Completed', count: completedCount }
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
                    padding: '16px 20px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                    color: isActive ? '#2563eb' : '#64748b',
                    fontWeight: isActive ? '700' : '600',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '1px 7px',
                    borderRadius: '9999px',
                    backgroundColor: tab.isDanger ? '#fee2e2' : isActive ? '#2563eb' : '#e2e8f0',
                    color: tab.isDanger ? '#dc2626' : isActive ? '#ffffff' : '#64748b'
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ padding: '6px 10px 6px 30px', fontSize: '0.82rem', backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        {/* Tasks List Content */}
        <div style={{ padding: '16px 20px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
              <CheckSquare size={36} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '0.96rem', fontWeight: '700', color: '#0f172a' }}>No tasks found in this view</div>
              <p style={{ fontSize: '0.84rem', marginTop: '4px' }}>All caught up or try switching tabs!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTasks.map(task => {
                const dueStr = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
                const isOverdue = !task.isCompleted && dueStr && dueStr < todayStr;
                const isToday = !task.isCompleted && dueStr === todayStr;

                return (
                  <div key={task.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    backgroundColor: task.isCompleted ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.15s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => completeTask(task.id)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          color: task.isCompleted ? '#94a3b8' : '#0f172a',
                          textDecoration: task.isCompleted ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span>Type: <strong>{task.type || 'Follow-up'}</strong></span>
                          <span>•</span>
                          <span>Lead: <strong>{task.leadName || 'Sahyadri Agro'}</strong></span>
                          <span>•</span>
                          <span>Rep: <strong>{task.assignedTo || 'Ajay Bhor'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Due date badge */}
                      {task.dueDate && (
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: isOverdue ? '#fee2e2' : isToday ? '#fef3c7' : '#eff6ff',
                          color: isOverdue ? '#dc2626' : isToday ? '#d97706' : '#2563eb'
                        }}>
                          {isOverdue ? 'Overdue: ' : isToday ? 'Due Today: ' : 'Due: '}{task.dueDate}
                        </span>
                      )}

                      {/* Priority badge */}
                      <span className={`badge ${task.priority === 'High' ? 'badge-lost' : 'badge-new'}`}>
                        {task.priority || 'Normal'}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                        title="Delete task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultType="Follow-up" />
      )}
    </div>
  );
};

export default Tasks;
