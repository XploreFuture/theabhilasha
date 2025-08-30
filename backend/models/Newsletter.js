import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure each email is stored only once
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Basic email regex validation
  },
  name: { // <-- NEW: Added name field
    type: String,
    trim: true,
    default: '', // Default to empty string if not provided
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
export default NewsletterSubscriber;