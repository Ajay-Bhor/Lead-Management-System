import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLeads } from './LeadContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

const API_URL = 'http://localhost:8080/api';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const { isAuthenticated } = useLeads();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchReminders();
    }
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
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/reminders`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setReminders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
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
        fetchReminders();
        return newTask;
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
    return newTask;
  };

  const completeTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      setTasks(prev => prev.map(task => task.id === id ? { ...task, isCompleted: true } : task));
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error completing task via API:', error);
      setTasks(prev => prev.map(task => task.id === id ? { ...task, isCompleted: true } : task));
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setTasks(prev => prev.filter(task => task.id !== id));
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting task via API:', error);
      setTasks(prev => prev.filter(task => task.id !== id));
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, reminders, addTask, completeTask, deleteTask, fetchTasks, fetchReminders }}>
      {children}
    </TaskContext.Provider>
  );
};
