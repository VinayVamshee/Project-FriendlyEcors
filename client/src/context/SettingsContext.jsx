import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export const API_BASE_URL = process.env.REACT_APP_API_URL ;

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    phone: '+1 (214) 555-0199',
    whatsapp: '12145550199',
    instagram: 'friendlyecors',
    facebook: 'friendlyecors',
    address: 'Dallas, TX',
    hours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed',
  });
  
  // Theme state: light by default
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      const result = await response.json();
      if (result.success && result.data) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings, using defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSettings),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setSettings(result.data);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    // Sync theme with HTML document attribute
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, theme, toggleTheme, loading, updateSettings, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
