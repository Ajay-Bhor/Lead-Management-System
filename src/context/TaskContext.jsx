import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLeads } from './LeadContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

const API_URL = 'http://localhost:8080/api';

const initialTasks = [
  { id: '1', title: 'Call Sarah regarding pricing', type: 'Call', dueDate: new Date().toISOString(), leadId: '1', isCompleted: false },
  { id: '2', title: 'Product demo with TechFlow', type: 'Meeting', dueDate: new Date(Date.now() + 86400000).toISOString(), leadId: '1', isCompleted: false },
  { id: '3', title: 'Follow-up email', type: 'Follow-up', dueDate: new Date(Date.now() - 86400000).toISOString(), leadId: '2', isCompleted: true },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const { isAuthenticated } = useLeads();

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setTasks(data);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [newTask, ...prev]);
        return;
      }
    } catch (error) {
      console.error('Error creating task via API:', error);
    }

    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const completeTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error completing task via API:', error);
    }
    setTasks(prev => prev.map(task => task.id === id ? { ...task, isCompleted: true } : task));
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting task via API:', error);
    }
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, completeTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
