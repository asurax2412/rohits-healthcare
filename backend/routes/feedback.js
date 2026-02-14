import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// POST - Submit new feedback (public, no auth required)
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ message: 'Name, rating, and message are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({ name, email, rating, message });
    await feedback.save();

    res.status(201).json({ message: 'Thank you for your feedback!', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
});

// GET - Fetch all approved feedback (public)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    // Calculate average rating from all approved feedbacks
    const allFeedbacks = await Feedback.find({ isApproved: true });
    const totalRatings = allFeedbacks.length;
    const avgRating = totalRatings > 0
      ? (allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalRatings).toFixed(1)
      : '0';

    res.json({
      feedbacks,
      stats: {
        averageRating: parseFloat(avgRating),
        totalReviews: totalRatings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
  }
});

export default router;
