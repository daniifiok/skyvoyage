import { flights, airports } from '../data/flights.js';

export function searchFlights({ from, to, date, passengers = 1, cabin }) {
  let results = flights.filter(
    (f) => f.from === from && f.to === to
  );

  if (cabin) {
    results = results.filter((f) => f.cabin === cabin);
  }

  // Sort by price
  results.sort((a, b) => a.price - b.price);

  // Add airport info
  return results.map((f) => ({
    ...f,
    fromAirport: airports.find((a) => a.code === f.from),
    toAirport: airports.find((a) => a.code === f.to),
  }));
}

export function getFlightById(id) {
  const flight = flights.find((f) => f.id === id);
  if (!flight) return null;
  return {
    ...flight,
    fromAirport: airports.find((a) => a.code === flight.from),
    toAirport: airports.find((a) => a.code === flight.to),
  };
}

export function getPopularRoutes() {
  const routeCounts = {};
  for (const f of flights) {
    const key = `${f.from}-${f.to}`;
    routeCounts[key] = (routeCounts[key] || 0) + 1;
  }
  return Object.entries(routeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([route, count]) => {
      const [from, to] = route.split('-');
      const fromAp = airports.find((a) => a.code === from);
      const toAp = airports.find((a) => a.code === to);
      const cheapest = flights
        .filter((f) => f.from === from && f.to === to)
        .sort((a, b) => a.price - b.price)[0];
      return { from: fromAp, to: toAp, count, price: cheapest?.price || 0 };
    });
}

export function getAllAirports() {
  return airports;
}
