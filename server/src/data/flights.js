// Mock flight data — in production this would come from a database or flight API
const airlines = [
  { code: 'SK', name: 'SkyVoyage Air', logo: '✈️' },
  { code: 'GL', name: 'Global Wings', logo: '🌍' },
  { code: 'PA', name: 'Pacific Air', logo: '🌊' },
  { code: 'EA', name: 'EuroAtlantic', logo: '🌐' },
  { code: 'AA', name: 'AeroAmerica', logo: '🦅' },
];

const airports = [
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles Intl' },
  { code: 'LHR', city: 'London', name: 'Heathrow' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda' },
  { code: 'SIN', city: 'Singapore', name: 'Changi' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare Intl" },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco Intl' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji' },
  { code: 'GRU', city: 'São Paulo', name: 'Guarulhos Intl' },
];

// Generate deterministic flights between city pairs
function generateFlights() {
  const flights = [];
  const routes = [
    ['JFK', 'LHR'], ['JFK', 'CDG'], ['JFK', 'DXB'], ['JFK', 'HND'],
    ['LAX', 'HND'], ['LAX', 'SYD'], ['LAX', 'SIN'], ['LAX', 'JFK'],
    ['LHR', 'CDG'], ['LHR', 'DXB'], ['LHR', 'JFK'], ['LHR', 'SIN'],
    ['CDG', 'DXB'], ['CDG', 'JFK'], ['DXB', 'SIN'], ['DXB', 'SYD'],
    ['HND', 'SIN'], ['HND', 'LAX'], ['SIN', 'SYD'], ['SIN', 'DXB'],
    ['ORD', 'JFK'], ['ORD', 'LAX'], ['SFO', 'JFK'], ['SFO', 'HND'],
    ['BOM', 'DXB'], ['BOM', 'LHR'], ['GRU', 'JFK'], ['GRU', 'CDG'],
  ];

  let id = 1;
  for (const [from, to] of routes) {
    const numFlights = 3 + Math.floor(Math.random() * 4); // 3-6 flights per route
    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const departHour = 6 + Math.floor(Math.random() * 16);
      const departMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const durationH = 2 + Math.floor(Math.random() * 14);
      const durationM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const basePrice = 150 + Math.floor(Math.random() * 850);

      flights.push({
        id: `FL${String(id++).padStart(4, '0')}`,
        airline,
        from,
        to,
        departure: `${String(departHour).padStart(2, '0')}:${String(departMin).padStart(2, '0')}`,
        duration: `${durationH}h ${durationM}m`,
        durationMinutes: durationH * 60 + durationM,
        price: basePrice,
        cabin: ['Economy', 'Premium Economy', 'Business', 'First'][Math.floor(Math.random() * 4)],
        stops: Math.random() > 0.6 ? 1 : 0,
        aircraft: ['Boeing 787', 'Airbus A350', 'Boeing 777', 'Airbus A380'][Math.floor(Math.random() * 4)],
      });
    }
  }
  return flights;
}

export const flights = generateFlights();
export { airlines, airports };
