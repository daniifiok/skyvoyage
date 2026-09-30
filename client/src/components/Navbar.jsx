import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span>✈️</span>
        SkyVoyage
      </Link>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Search Flights
        </Link>
        <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}>
          My Bookings
        </Link>
      </div>
    </nav>
  );
}
