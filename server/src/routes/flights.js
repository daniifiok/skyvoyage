import { Router } from 'express';
import { searchFlights, getFlightById, getPopularRoutes, getAllAirports } from '../services/flightService.js';

const router = Router();

router.get('/search', (req, res) => {
  const { from, to, date, passengers, cabin } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing required parameters: from, to' });
  }
  const results = searchFlights({ from, to, date, passengers: parseInt(passengers) || 1, cabin });
  res.json({ flights: results, count: results.length });
});

router.get('/popular', (req, res) => {
  res.json({ routes: getPopularRoutes() });
});

router.get('/airports', (req, res) => {
  res.json({ airports: getAllAirports() });
});

router.get('/:id', (req, res) => {
  const flight = getFlightById(req.params.id);
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  res.json({ flight });
});

export default router;
