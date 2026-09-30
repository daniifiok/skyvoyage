const API_BASE = '/api';

async function fetchJSON(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Flights
  searchFlights: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchJSON(`/flights/search?${query}`);
  },
  getFlight: (id) => fetchJSON(`/flights/${id}`),
  getPopularRoutes: () => fetchJSON('/flights/popular'),
  getAirports: () => fetchJSON('/flights/airports'),

  // Bookings
  createBooking: (data) =>
    fetchJSON('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: () => fetchJSON('/bookings'),
  getBooking: (id) => fetchJSON(`/bookings/${id}`),
  cancelBooking: (id) =>
    fetchJSON(`/bookings/${id}/cancel`, { method: 'PATCH' }),

  // AI Chat
  sendChatMessage: (message, context) =>
    fetchJSON('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
};
