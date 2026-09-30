import React from 'react';
import FlightCard from './FlightCard';

export default function ChatMessage({ message, onBook, onSuggestionClick }) {
  const isBot = message.role === 'bot';

  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      {message.content}
      {message.flights && message.flights.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {message.flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onBook={onBook} compact />
          ))}
        </div>
      )}
      {message.suggestions && message.suggestions.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {message.suggestions.map((s, i) => (
            <button key={i} className="chat-suggestion" onClick={() => onSuggestionClick(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
