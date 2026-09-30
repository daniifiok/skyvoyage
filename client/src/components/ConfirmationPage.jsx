import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../utils/helpers';

export default function ConfirmationPage({ booking }) {
  if (!booking) return null;

  return (
    <div className="confirmation">
      <div className="confirmation-icon">✅</div>
      <h2>Booking Confirmed!</h2>
      <p>Your flight has been successfully booked. Here are your details:</p>

      <div className="booking-details">
        <h4>Booking Reference</h4>
        <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{booking.id}</p>

        <h4>Flight</h4>
        <p>
          {booking.flight.fromAirport.city} → {booking.flight.toAirport.city}
          <br />
          <span style={{ color: 'var(--gray-500)', fontSize: 14 }}>
            {booking.flight.airline.name} • {booking.flight.departure} • {booking.flight.duration}
          </span>
        </p>

        <h4>Passengers</h4>
        <p>
          {booking.passengers.map((p, i) => (
            <span key={i}>
              {p.firstName} {p.lastName}
              {i < booking.passengers.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>

        <h4>Total Paid</h4>
        <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>
          {formatPrice(booking.totalPrice)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Book Another Flight</Link>
        <Link to="/bookings" className="btn btn-secondary">View My Bookings</Link>
      </div>
    </div>
  );
}
