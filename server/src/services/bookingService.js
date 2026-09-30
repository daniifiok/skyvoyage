import { v4 as uuidv4 } from 'uuid';
import { getFlightById } from './flightService.js';

// In-memory store — replace with a database in production
const bookings = new Map();

export function createBooking({ flightId, passengers, contactEmail, contactPhone }) {
  const flight = getFlightById(flightId);
  if (!flight) {
    throw new Error('Flight not found');
  }

  const booking = {
    id: `BK${uuidv4().slice(0, 8).toUpperCase()}`,
    flight,
    passengers,
    contactEmail,
    contactPhone,
    totalPrice: flight.price * passengers.length,
    status: 'confirmed',
    bookedAt: new Date().toISOString(),
  };

  bookings.set(booking.id, booking);
  return booking;
}

export function getBooking(id) {
  return bookings.get(id) || null;
}

export function getAllBookings() {
  return Array.from(bookings.values()).sort(
    (a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)
  );
}

export function cancelBooking(id) {
  const booking = bookings.get(id);
  if (!booking) return null;
  booking.status = 'cancelled';
  bookings.set(id, booking);
  return booking;
}
