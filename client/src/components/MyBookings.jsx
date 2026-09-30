import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data.bookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.cancelBooking(id);
      loadBookings();
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="my-bookings">
        <div className="loading">
          <div className="spinner" />
          Loading your bookings...
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Your booked flights will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings ({bookings.length})</h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="booking-card">
          <div className="booking-card-header">
            <h4>{booking.flight.fromAirport.city} → {booking.flight.toAirport.city}</h4>
            <span className={`status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}`}>
              {booking.status}
            </span>
          </div>
          <div className="flight-details" style={{ marginBottom: 12 }}>
            <span>✈️ {booking.flight.airline.name}</span>
            <span>🕐 {booking.flight.departure}</span>
            <span>⏱️ {booking.flight.duration}</span>
            <span>💺 {booking.flight.cabin}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>
                {booking.passengers.length} passenger{booking.passengers.length !== 1 ? 's' : ''} • Booked {formatDate(booking.bookedAt)}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>
                {formatPrice(booking.totalPrice)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--gray-500)' }}>
                {booking.id}
              </span>
              {booking.status === 'confirmed' && (
                <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => handleCancel(booking.id)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
