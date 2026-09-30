import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatPrice } from '../utils/helpers';

export default function BookingModal({ flight, onClose, onConfirmed }) {
  const { setBooking } = useApp();
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', email: '', phone: '' },
  ]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = flight.price * passengers.length;

  const updatePassenger = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers((prev) => [...prev, { firstName: '', lastName: '', email: '', phone: '' }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    for (const p of passengers) {
      if (!p.firstName || !p.lastName) {
        setError('Please fill in all passenger names');
        return;
      }
    }
    if (!contactEmail) {
      setError('Please provide a contact email');
      return;
    }

    setLoading(true);
    try {
      const result = await api.createBooking({
        flightId: flight.id,
        passengers,
        contactEmail,
        contactPhone,
      });
      setBooking(result.booking);
      onConfirmed(result.booking);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Book Flight</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 20, padding: 16, background: 'var(--gray-50)', borderRadius: 8 }}>
            <strong>{flight.fromAirport.city} → {flight.toAirport.city}</strong>
            <div style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 4 }}>
              {flight.airline.name} • {flight.departure} • {flight.duration} • {flight.cabin}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', marginTop: 8 }}>
              {formatPrice(flight.price)} <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>per person</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="passenger-form">
            {passengers.map((p, i) => (
              <div key={i} style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <strong>Passenger {i + 1}</strong>
                  {passengers.length > 1 && (
                    <button type="button" className="btn btn-danger" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => removePassenger(i)}>
                      Remove
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={p.firstName}
                      onChange={(e) => updatePassenger(i, 'firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={p.lastName}
                      onChange={(e) => updatePassenger(i, 'lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 6 && (
              <button type="button" className="btn btn-outline" onClick={addPassenger}>
                + Add Passenger
              </button>
            )}

            <div style={{ marginTop: 16 }}>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginTop: 16 }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: 20, padding: 16, background: 'var(--primary-light)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>Total Price</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>
                {formatPrice(totalPrice)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                {passengers.length} passenger{passengers.length !== 1 ? 's' : ''} × {formatPrice(flight.price)}
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
