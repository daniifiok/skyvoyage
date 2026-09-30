import { Router } from 'express';
import { createBooking, getBooking, getAllBookings, cancelBooking } from '../services/bookingService.js';

const router = Router();

router.post('/', (req, res) => {
  const { flightId, passengers, contactEmail, contactPhone } = req.body;
  if (!flightId || !passengers || !contactEmail) {
    return res.status(400).json({ error: 'Missing required fields: flightId, passengers, contactEmail' });
  }
  try {
    const booking = createBooking({ flightId, passengers, contactEmail, contactPhone });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  res.json({ bookings: getAllBookings() });
});

router.get('/:id', (req, res) => {
  const booking = getBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ booking });
});

router.patch('/:id/cancel', (req, res) => {
  const booking = cancelBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ booking });
});

export default router;
