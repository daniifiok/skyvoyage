import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import { useApp } from './context/AppContext';

export default function App() {
  const { setSelectedFlight } = useApp();

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
      <ChatWidget onBookFlight={handleBookFlight} />
      <footer className="footer">
        <p>SkyVoyage — AI-Powered Flight Booking • Built with React & Node.js</p>
      </footer>
    </>
  );
}
