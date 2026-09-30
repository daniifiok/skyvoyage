import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import ChatMessage from './ChatMessage';

export default function ChatWidget({ onBookFlight }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello! I'm SkyVoyage AI, your travel assistant. I can help you find flights, compare prices, and book your trip. Where would you like to go?",
      suggestions: ['Flights from New York to London', 'Cheapest flights to Tokyo', 'Popular routes'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: response.content,
          flights: response.flights,
          suggestions: response.suggestions,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: 'Sorry, I had trouble processing that. Please try again.',
          suggestions: ['Help', 'Popular routes'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleBookFlight = (flight) => {
    onBookFlight(flight);
    setIsOpen(false);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-avatar">✈️</div>
            <div className="chat-header-info">
              <h4>SkyVoyage AI</h4>
              <p>Your travel assistant</p>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                message={msg}
                onBook={handleBookFlight}
                onSuggestionClick={handleSuggestionClick}
              />
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="loading" style={{ padding: 8 }}>
                  <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about flights..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '✈️'}
      </button>
    </div>
  );
}
