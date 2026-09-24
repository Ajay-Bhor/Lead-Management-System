import React, { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

export const useLeads = () => useContext(LeadContext);

const API_URL = 'http://localhost:8080/api';

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { name: 'Ajay Bhor', role: 'Admin', email: 'admin@urjafoods.com', username: 'admin' };
  });
  const [selectedLead, setSelectedLead] = useState(null); // For detail drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      setIsAuthenticated(true);
      fetchLeads(token);
    } else {
      localStorage.removeItem('jwt_token');
      setIsAuthenticated(false);
    }
  }, [token]);

  const getAuthHeaders = (overrideToken) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${overrideToken || token || localStorage.getItem('jwt_token')}`
  });

  const login = async (username, password) => {
    try {
      localStorage.removeItem('has_logged_out');
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        const profile = {
          name: data.name || (username === 'admin' ? 'Ajay Bhor' : username),
          username: data.username || username,
          email: username.includes('@') ? username : `${username}@urjafoods.com`,
          role: data.role || (username === 'admin' ? 'Admin' : 'Sales Executive')
        };
        setCurrentUser(profile);
        localStorage.setItem('user_profile', JSON.stringify(profile));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async ({ fullName, email, phone, password, role }) => {
    try {
      localStorage.removeItem('has_logged_out');
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: email,
          name: fullName,
          password: password,
          role: role || 'Sales Executive'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message || 'Account created successfully by Administrator.' };
      } else {
        const err = await response.json().catch(() => ({}));
        if (response.status === 403 || response.status === 401) {
          return { success: false, message: 'Access Denied: Only Administrators are authorized to create users.' };
        }
        return { success: false, message: err.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Unable to connect to server' };
    }
  };

  const logout = () => {
    localStorage.setItem('has_logged_out', 'true');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    setToken('');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const fetchLeads = async (overrideToken) => {
    try {
      const response = await fetch(`${API_URL}/leads`, { headers: getAuthHeaders(overrideToken) });
      if (response.ok) {
        const data = await response.json();
        setLeads(Array.isArray(data) ? data : []);
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
        return newLead;
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
    return null;
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}/stage`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stage: newStatus })
      });

      if (response.ok) {
        const updatedLead = await response.json();
        setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
        if (selectedLead?.id === id) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
    } catch (error) {
      console.error('Error updating lead stage:', error);
    }

    // Fallback local update
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const updateLead = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        await fetchLeads();
        if (selectedLead?.id === id) {
          setSelectedLead(prev => ({ ...prev, ...updatedData }));
        }
        return true;
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updatedData } : lead));
    return false;
  };

  const reassignLead = async (id, assignee) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}/reassign`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ assignee })
      });

      if (response.ok) {
        const updatedLead = await response.json();
        setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
        if (selectedLead?.id === id) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
    } catch (error) {
      console.error('Error reassigning lead:', error);
    }
  };

  const deleteLead = async (id) => {
    try {
      await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setLeads(prev => prev.filter(lead => lead.id !== id));
      if (selectedLead?.id === id) {
        setIsDrawerOpen(false);
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
  };

  const fetchActivities = async (leadId) => {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/activities`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
    return [];
  };

  const addActivity = async (leadId, activityData) => {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(activityData)
      });
      if (response.ok) {
        const createdActivity = await response.json();
        // Refresh leads to get updated score
        fetchLeads();
        return createdActivity;
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
    return null;
  };

  const simulateLeadCapture = async () => {
    const demoSources = ['Website forms', 'Social media', 'Email campaigns', 'Phone calls'];
    const demoCompanies = ['Baramati Agro Ltd', 'Sahyadri Farmers Producer Co', 'Godrej Agrovet Partner', 'Kalyani Food Processing', 'Shree Ganesh Dairy'];
    const demoCities = ['Pune', 'Nashik', 'Kolhapur', 'Nagpur', 'Aurangabad'];
    
    const randomCompany = demoCompanies[Math.floor(Math.random() * demoCompanies.length)];
    const randomCity = demoCities[Math.floor(Math.random() * demoCities.length)];
    const randomSource = demoSources[Math.floor(Math.random() * demoSources.length)];
    const randomValue = Math.floor(Math.random() * 400 + 50) * 1000; // 50,000 to 450,000

    const newLeadPayload = {
      name: `Ramesh ${['Patil', 'Deshmukh', 'Jadhav', 'Shinde', 'Chavan'][Math.floor(Math.random() * 5)]}`,
      company: randomCompany,
      email: `contact@${randomCompany.toLowerCase().replace(/[^a-z]/g, '')}.in`,
      phone: `+91 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
      source: randomSource,
      status: 'New',
      dealValue: randomValue,
      territory: randomCity,
      assignedTo: 'Auto Round-Robin',
      notes: `Inbound inquiry via ${randomSource} regarding commercial bulk contract.`
    };

    return await addLead(newLeadPayload);
  };

  const openLeadDetail = (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const closeLeadDetail = () => {
    setIsDrawerOpen(false);
    setSelectedLead(null);
  };

  const [editingLead, setEditingLead] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditLead = (lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };

  const closeEditLead = () => {
    setIsEditModalOpen(false);
    setEditingLead(null);
  };

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <LeadContext.Provider value={{
      leads,
      addLead,
      updateLead,
      updateLeadStatus,
      reassignLead,
      deleteLead,
      fetchLeads,
      fetchActivities,
      addActivity,
      simulateLeadCapture,
      selectedLead,
      isDrawerOpen,
      openLeadDetail,
      closeLeadDetail,
      editingLead,
      isEditModalOpen,
      openEditLead,
      closeEditLead,
      login,
      register,
      logout,
      currentUser,
      setCurrentUser,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </LeadContext.Provider>
  );
};
