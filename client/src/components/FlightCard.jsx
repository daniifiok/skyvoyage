import React from 'react';
import { formatPrice } from '../utils/helpers';

export default function FlightCard({ flight, onBook, compact = false }) {
  if (compact) {
    return (
      <div className="flight-mini">
        <div className="route">
          {flight.fromAirport.city} → {flight.toAirport.city}
        </div>
        <div className="details">
          {flight.airline.name} • {flight.departure} • {flight.duration} • {formatPrice(flight.price)}
        </div>
      </div>
    );
  }

  return (
    <div className="flight-card">
      <div className="flight-info">
        <div className="flight-route">
          <span className="city">{flight.fromAirport.city}</span>
          <span className="arrow">→</span>
          <span className="city">{flight.toAirport.city}</span>
        </div>
        <div className="flight-details">
          <span>✈️ {flight.airline.name}</span>
          <span>🕐 {flight.departure}</span>
          <span>⏱️ {flight.duration}</span>
          <span>💺 {flight.cabin}</span>
          {flight.stops > 0 && <span>🔄 {flight.stops} stop</span>}
        </div>
      </div>
      <div className="flight-price">
        <div className="price">{formatPrice(flight.price)}</div>
        <div className="per-person">per person</div>
        <button className="btn btn-primary" onClick={() => onBook(flight)} style={{ marginTop: 12 }}>
          Book Now
        </button>
      </div>
    </div>
  );
}
