import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [searchResults, setSearchResults] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [booking, setBooking] = useState(null);
  const [airports, setAirports] = useState([]);

  const updateSearchResults = useCallback((results, params) => {
    setSearchResults(results);
    setSearchParams(params);
  }, []);

  const value = {
    searchResults,
    searchParams,
    selectedFlight,
    booking,
    airports,
    setSearchResults: updateSearchResults,
    setSelectedFlight,
    setBooking,
    setAirports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
