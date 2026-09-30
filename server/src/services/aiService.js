import { airports, flights } from '../data/flights.js';
import { searchFlights } from './flightService.js';

// City name to airport code mapping
const cityAliases = {
  'new york': 'JFK', 'nyc': 'JFK', 'ny': 'JFK',
  'los angeles': 'LAX', 'la': 'LAX',
  'london': 'LHR',
  'paris': 'CDG',
  'dubai': 'DXB',
  'tokyo': 'HND',
  'singapore': 'SIN',
  'sydney': 'SYD',
  'chicago': 'ORD',
  'san francisco': 'SFO', 'sf': 'SFO',
  'mumbai': 'BOM', 'bombay': 'BOM',
  'sao paulo': 'GRU', 'são paulo': 'GRU',
};

// Common date patterns
const datePatterns = [
  { regex: /tomorrow/i, offset: 1 },
  { regex: /day after tomorrow/i, offset: 2 },
  { regex: /next week/i, offset: 7 },
  { regex: /in (\d+) days?/i, offset: null }, // dynamic
  { regex: /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i, type: 'mdy' },
  { regex: /(\d{1,2})-(\d{1,2})(?:-(\d{2,4}))?/i, type: 'mdy' },
  { regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{1,2})(?:st|nd|rd|th)?(?:,? (\d{4}))?/i, type: 'month' },
];

const monthMap = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function extractCities(text) {
  const lower = text.toLowerCase();
  const found = [];

  // Check for "from X to Y" pattern
  const fromToMatch = lower.match(/from\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+(?:on|for|next|tomorrow|today|in|with|and|booking|book|find|search|fly|flight|flights|go|going|travel|want|need|please|can|could|would|will|i|my|we|me|a|an|the)\b|$)/i);
  if (fromToMatch) {
    const fromCity = fromToMatch[1].trim();
    const toCity = fromToMatch[2].trim();
    const fromCode = cityAliases[fromCity] || findAirportByCity(fromCity);
    const toCode = cityAliases[toCity] || findAirportByCity(toCity);
    if (fromCode && toCode) {
      return { from: fromCode, to: toCode };
    }
  }

  // Check for "X to Y" pattern
  const toMatch = lower.match(/([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+(?:on|for|next|tomorrow|today|in|with|and|booking|book|find|search|fly|flight|flights|go|going|travel|want|need|please|can|could|would|will|i|my|we|me|a|an|the)\b|$)/i);
  if (toMatch) {
    const fromCity = toMatch[1].trim();
    const toCity = toMatch[2].trim();
    const fromCode = cityAliases[fromCity] || findAirportByCity(fromCity);
    const toCode = cityAliases[toCity] || findAirportByCity(toCity);
    if (fromCode && toCode) {
      return { from: fromCode, to: toCode };
    }
  }

  // Fallback: find any mentioned cities
  for (const [name, code] of Object.entries(cityAliases)) {
    if (lower.includes(name) && !found.includes(code)) {
      found.push(code);
    }
  }
  if (found.length >= 2) {
    return { from: found[0], to: found[1] };
  }
  if (found.length === 1) {
    return { from: found[0], to: null };
  }

  return null;
}

function findAirportByCity(cityName) {
  const lower = cityName.toLowerCase();
  const airport = airports.find(
    (a) => a.city.toLowerCase() === lower || a.name.toLowerCase().includes(lower)
  );
  return airport?.code || null;
}

function extractDate(text) {
  const lower = text.toLowerCase();

  for (const pattern of datePatterns) {
    const match = lower.match(pattern.regex);
    if (!match) continue;

    if (pattern.type === 'mdy') {
      const month = parseInt(match[1]) - 1;
      const day = parseInt(match[2]);
      const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
      const fullYear = year < 100 ? 2000 + year : year;
      const date = new Date(fullYear, month, day);
      if (date >= new Date(new Date().setHours(0, 0, 0, 0))) {
        return date;
      }
    } else if (pattern.type === 'month') {
      const month = monthMap[match[1].slice(0, 3)];
      const day = parseInt(match[2]);
      const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
      const date = new Date(year, month, day);
      if (date >= new Date(new Date().setHours(0, 0, 0, 0))) {
        return date;
      }
    } else if (pattern.offset !== null) {
      const date = new Date();
      date.setDate(date.getDate() + pattern.offset);
      return date;
    } else if (match[1]) {
      const days = parseInt(match[1]);
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }
  }

  // Default: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function extractPassengers(text) {
  const lower = text.toLowerCase();
  const match = lower.match(/(\d+)\s*(?:passenger|person|people|traveler|traveller|adult|kid|child|children)/);
  if (match) return parseInt(match[1]);

  if (lower.includes('solo') || lower.includes('just me') || lower.includes('myself')) return 1;
  if (lower.includes('couple') || lower.includes('two of us') || lower.includes('my wife') || lower.includes('my husband') || lower.includes('my partner')) return 2;
  if (lower.includes('family')) return 4;

  return 1;
}

function extractCabin(text) {
  const lower = text.toLowerCase();
  if (lower.includes('first class') || lower.includes('first-class')) return 'First';
  if (lower.includes('business')) return 'Business';
  if (lower.includes('premium')) return 'Premium Economy';
  if (lower.includes('economy')) return 'Economy';
  return null;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFlight(flight) {
  const fromAp = airports.find((a) => a.code === flight.from);
  const toAp = airports.find((a) => a.code === flight.to);
  return `${flight.airline.name} ${flight.id}: ${fromAp.city} (${flight.from}) → ${toAp.city} (${flight.to}), departs ${flight.departure}, ${flight.duration}, $${flight.price}`;
}

export function processMessage(message, context = {}) {
  const lower = message.toLowerCase().trim();

  // Greeting
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings)\b/.test(lower)) {
    return {
      type: 'text',
      content: "Hello! I'm SkyVoyage AI, your travel assistant. I can help you:\n\n• Search for flights\n• Find the best deals\n• Book a trip\n• Answer travel questions\n\nWhere would you like to go?",
      suggestions: ['Flights from New York to London', 'Cheapest flights to Tokyo', 'Book a business class flight'],
    };
  }

  // Help
  if (lower.includes('help') || lower.includes('what can you do') || lower.includes('how do you work')) {
    return {
      type: 'text',
      content: "I can help you with:\n\n• **Search flights** — Try: \"Find flights from NYC to London tomorrow\"\n• **Compare prices** — Try: \"What's the cheapest way to get to Tokyo?\"\n• **Book flights** — Try: \"Book a business class flight to Paris\"\n• **Travel info** — Try: \"What are the popular routes?\"\n\nJust tell me where you want to go!",
      suggestions: ['Find flights from New York to London', 'Popular routes', 'Cheapest flights to Dubai'],
    };
  }

  // Popular routes
  if (lower.includes('popular') || lower.includes('trending') || lower.includes('best route') || lower.includes('top destination')) {
    const popular = getPopularRoutes();
    const lines = popular.map(
      (r, i) => `${i + 1}. **${r.from.city} → ${r.to.city}** — from $${r.price}`
    );
    return {
      type: 'text',
      content: `Here are the most popular routes right now:\n\n${lines.join('\n')}\n\nWould you like to search for flights on any of these routes?`,
      suggestions: ['Flights from New York to London', 'Flights from Los Angeles to Tokyo', 'Flights from London to Dubai'],
    };
  }

  // Cheapest flights
  if (lower.includes('cheap') || lower.includes('deal') || lower.includes('budget') || lower.includes('affordable')) {
    const cities = extractCities(message);
    if (cities && cities.from && cities.to) {
      const results = searchFlights({ from: cities.from, to: cities.to });
      if (results.length > 0) {
        const cheapest = results[0];
        return {
          type: 'text',
          content: `The cheapest flight from ${cheapest.fromAirport.city} to ${cheapest.toAirport.city} is:\n\n${formatFlight(cheapest)}\n\nWould you like to see more options or book this flight?`,
          suggestions: ['Show more flights', 'Book this flight', 'Find flights from New York to London'],
        };
      }
    }
    return {
      type: 'text',
      content: "I'd love to find you a great deal! Which cities are you traveling between? For example: \"Cheap flights from NYC to London\"",
      suggestions: ['Cheap flights from New York to London', 'Cheap flights from LA to Tokyo', 'Popular routes'],
    };
  }

  // Booking intent
  if (lower.includes('book') || lower.includes('reserve') || lower.includes('buy ticket')) {
    const cities = extractCities(message);
    const date = extractDate(message);
    const passengers = extractPassengers(message);
    const cabin = extractCabin(message);

    if (cities && cities.from && cities.to) {
      const results = searchFlights({ from: cities.from, to: cities.to, cabin });
      if (results.length > 0) {
        const topResults = results.slice(0, 3);
        const flightList = topResults.map((f, i) => `${i + 1}. ${formatFlight(f)}`).join('\n');
        return {
          type: 'flight_results',
          content: `I found ${results.length} flight(s) from ${topResults[0].fromAirport.city} to ${topResults[0].toAirport.city} on ${formatDate(date)} for ${passengers} passenger(s):\n\n${flightList}\n\nWould you like to book one of these? Just click "Book" on any flight!`,
          flights: topResults,
          searchParams: { from: cities.from, to: cities.to, date, passengers, cabin },
          suggestions: ['Show more flights', 'Change date', 'Different cities'],
        };
      }
      return {
        type: 'text',
        content: `I couldn't find flights from ${cities.from} to ${cities.to}. Would you like to try different cities?`,
        suggestions: ['Popular routes', 'Flights from New York to London', 'Flights from LA to Tokyo'],
      };
    }
    return {
      type: 'text',
      content: "I can help you book a flight! Please tell me:\n1. Where are you flying from?\n2. Where are you going?\n3. When do you want to travel?\n\nFor example: \"Book a flight from New York to London tomorrow for 2 passengers\"",
      suggestions: ['Book flights from NYC to London', 'Book business class to Paris', 'Popular routes'],
    };
  }

  // Flight search
  if (lower.includes('flight') || lower.includes('fly') || lower.includes('travel') || lower.includes('go to') || lower.includes('visit')) {
    const cities = extractCities(message);
    const date = extractDate(message);
    const passengers = extractPassengers(message);
    const cabin = extractCabin(message);

    if (cities && cities.from && cities.to) {
      const results = searchFlights({ from: cities.from, to: cities.to, cabin });
      if (results.length > 0) {
        const topResults = results.slice(0, 3);
        const flightList = topResults.map((f, i) => `${i + 1}. ${formatFlight(f)}`).join('\n');
        return {
          type: 'flight_results',
          content: `I found ${results.length} flight(s) from ${topResults[0].fromAirport.city} to ${topResults[0].toAirport.city} on ${formatDate(date)} for ${passengers} passenger(s):\n\n${flightList}\n\nClick "Book" on any flight to proceed!`,
          flights: topResults,
          searchParams: { from: cities.from, to: cities.to, date, passengers, cabin },
          suggestions: ['Show more flights', 'Change date', 'Different cities'],
        };
      }
      return {
        type: 'text',
        content: `I couldn't find flights from ${cities.from} to ${cities.to}. Would you like to try different cities?`,
        suggestions: ['Popular routes', 'Flights from New York to London', 'Flights from LA to Tokyo'],
      };
    }

    if (cities && cities.from) {
      return {
        type: 'text',
        content: `I see you want to travel from ${cities.from}. Where would you like to go?`,
        suggestions: ['To London', 'To Tokyo', 'To Dubai', 'Popular routes'],
      };
    }

    return {
      type: 'text',
      content: "I can help you find flights! Please tell me where you're flying from and to. For example: \"Find flights from New York to London\"",
      suggestions: ['Flights from New York to London', 'Flights from LA to Tokyo', 'Flights from London to Dubai'],
    };
  }

  // Thank you
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('appreciate')) {
    return {
      type: 'text',
      content: "You're welcome! Is there anything else I can help you with?",
      suggestions: ['Find flights', 'Popular routes', 'No, that\'s all'],
    };
  }

  // Goodbye
  if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you') || lower.includes('that\'s all') || lower.includes('no, that\'s all')) {
    return {
      type: 'text',
      content: "Goodbye! Have a wonderful trip! ✈️",
      suggestions: ['Start over', 'Find flights'],
    };
  }

  // Default: try to extract cities and search
  const cities = extractCities(message);
  if (cities && cities.from && cities.to) {
    const date = extractDate(message);
    const passengers = extractPassengers(message);
    const results = searchFlights({ from: cities.from, to: cities.to });
    if (results.length > 0) {
      const topResults = results.slice(0, 3);
      const flightList = topResults.map((f, i) => `${i + 1}. ${formatFlight(f)}`).join('\n');
      return {
        type: 'flight_results',
        content: `I found ${results.length} flight(s) from ${topResults[0].fromAirport.city} to ${topResults[0].toAirport.city}:\n\n${flightList}\n\nClick "Book" on any flight to proceed!`,
        flights: topResults,
        searchParams: { from: cities.from, to: cities.to, date, passengers, cabin: null },
        suggestions: ['Show more flights', 'Change date', 'Different cities'],
      };
    }
  }

  return {
    type: 'text',
    content: "I'm not sure I understood that. I can help you search for flights, find deals, or book a trip. Try saying something like:\n\n• \"Find flights from New York to London\"\n• \"Cheap flights to Tokyo\"\n• \"Book a business class flight to Paris\"",
    suggestions: ['Find flights from New York to London', 'Popular routes', 'Help'],
  };
}

function getPopularRoutes() {
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
