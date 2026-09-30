import React from 'react';
import FlightCard from './FlightCard';

export default function FlightResults({ flights, onBook, loading }) {
  if (loading) {
    return (
      <div className="flight-results">
        <div className="loading">
          <div className="spinner" />
          Searching for flights...
        </div>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="flight-results">
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No flights found</h3>
          <p>Try different dates or destinations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-results">
      <h2>{flights.length} flight{flights.length !== 1 ? 's' : ''} found</h2>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} onBook={onBook} />
      ))}
    </div>
  );
}
