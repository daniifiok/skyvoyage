import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import SearchForm from '../components/SearchForm';
import FlightResults from '../components/FlightResults';
import BookingModal from '../components/BookingModal';
import ConfirmationPage from '../components/ConfirmationPage';
import { formatPrice } from '../utils/helpers';

export default function HomePage() {
  const { searchResults, searchParams, setSearchResults, selectedFlight, setSelectedFlight, booking, setBooking } = useApp();
  const [loading, setLoading] = useState(false);
  const [popularRoutes, setPopularRoutes] = useState([]);

  useEffect(() => {
    api.getPopularRoutes().then((data) => setPopularRoutes(data.routes)).catch(() => {});
  }, []);

  const handleSearch = (flights, params) => {
    setSearchResults(flights, params);
  };

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
  };

  const handleBookingConfirmed = (confirmedBooking) => {
    setBooking(confirmedBooking);
    setSelectedFlight(null);
  };

  const handleRouteClick = (route) => {
    setSearchResults(null, null);
    // Pre-fill search form
    const event = new CustomEvent('prefillSearch', { detail: { from: route.from.code, to: route.to.code } });
    window.dispatchEvent(event);
  };

  if (booking) {
    return <ConfirmationPage booking={booking} />;
  }

  return (
    <>
      <div className="hero">
        <h1>Find Your Perfect Flight</h1>
        <p>Search hundreds of flights and book with confidence. Our AI assistant is here to help 24/7.</p>
      </div>

      <SearchForm onSearch={handleSearch} initialParams={searchParams} />

      {searchResults && (
        <FlightResults
          flights={searchResults}
          onBook={handleBookFlight}
          loading={loading}
        />
      )}

      {!searchResults && popularRoutes.length > 0 && (
        <div className="popular-routes">
          <h2>Popular Routes</h2>
          <div className="routes-grid">
            {popularRoutes.map((route, i) => (
              <div key={i} className="route-card" onClick={() => handleRouteClick(route)}>
                <div className="cities">
                  {route.from.city} → {route.to.city}
                </div>
                <div className="price">from {formatPrice(route.price)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
          onConfirmed={handleBookingConfirmed}
        />
      )}
    </>
  );
}
