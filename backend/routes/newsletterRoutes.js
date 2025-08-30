import express from 'express';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

const router = express.Router();

// POST /api/newsletter/subscribe - Subscribe a new email and name to the newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body; // <-- UPDATED: Destructure 'name'

    // Basic validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Attempt to create a new subscriber
    const newSubscriber = new NewsletterSubscriber({ email, name: name || '' }); // <-- UPDATED: Pass name, default to empty string if null/undefined
    await newSubscriber.save();

    res.status(201).json({ message: 'Successfully subscribed to the newsletter!', subscriber: newSubscriber });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error: Failed to subscribe.', error: error.message });
  }
});

export default router;