import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

const initialTasks = [
  { id: '1', title: 'Call Sarah regarding pricing', type: 'Call', dueDate: new Date().toISOString(), leadId: '1', isCompleted: false },
  { id: '2', title: 'Product demo with TechFlow', type: 'Meeting', dueDate: new Date(Date.now() + 86400000).toISOString(), leadId: '1', isCompleted: false },
  { id: '3', title: 'Follow-up email', type: 'Follow-up', dueDate: new Date(Date.now() - 86400000).toISOString(), leadId: '2', isCompleted: true },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('leadgen_tasks');
    if (savedTasks) return JSON.parse(savedTasks);
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('leadgen_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const completeTask = (id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, isCompleted: true } : task));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, completeTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
