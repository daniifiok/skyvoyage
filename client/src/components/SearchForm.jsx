import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { getTomorrowString } from '../utils/helpers';

export default function SearchForm({ onSearch, initialParams }) {
  const { airports, setAirports } = useApp();
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: getTomorrowString(),
    passengers: 1,
    cabin: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (airports.length === 0) {
      api.getAirports().then((data) => setAirports(data.airports)).catch(() => {});
    }
  }, [airports.length, setAirports]);

  useEffect(() => {
    if (initialParams) {
      setForm((prev) => ({ ...prev, ...initialParams }));
    }
  }, [initialParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    setLoading(true);
    try {
      const results = await api.searchFlights(form);
      onSearch(results.flights, form);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const swapCities = () => {
    setForm((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form-grid">
        <div className="form-group">
          <label>From</label>
          <select name="from" value={form.from} onChange={handleChange} required>
            <option value="">Select origin</option>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>To</label>
          <select name="to" value={form.to} onChange={handleChange} required>
            <option value="">Select destination</option>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Departure Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Passengers</label>
          <select name="passengers" value={form.passengers} onChange={handleChange}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Passenger' : 'Passengers'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cabin Class</label>
          <select name="cabin" value={form.cabin} onChange={handleChange}>
            <option value="">Any</option>
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First">First</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>
    </form>
  );
}
