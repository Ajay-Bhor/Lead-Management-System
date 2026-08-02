import React, { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

export const useLeads = () => useContext(LeadContext);

// Change this to your ASP.NET Core API URL
const API_URL = 'http://localhost:8080/api';

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      localStorage.removeItem('jwt_token');
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setToken('');
    setLeads([]);
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/leads`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const addLead = async (leadData) => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(leadData)
      });
      
      if (response.ok) {
        const newLead = await response.json();
        setLeads(prev => [newLead, ...prev]);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    const leadToUpdate = leads.find(l => l.id === id);
    if (!leadToUpdate) return;
    
    const updatedLead = { ...leadToUpdate, status: newStatus };
    
    try {
      await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedLead)
      });
      setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
    } catch (error) {
      console.error('Error updating lead:', error);
      setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
    }
  };

  const deleteLead = async (id) => {
    try {
      await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLeadStatus, deleteLead, login, logout, isAuthenticated }}>
      {children}
    </LeadContext.Provider>
  );
};
