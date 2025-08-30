import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { FaPaperPlane } from 'react-icons/fa'; // Icon for the subscribe button


interface NewsletterSubscribeFormProps {
  className?: string; // Optional classes for the container div
}

const NewsletterSubscribeForm: React.FC<NewsletterSubscribeFormProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setMessageType(null);
    setLoading(true);

    // FIX: Updated regex to remove unnecessary escapes for '.' and '-' inside character sets.
    // The hyphen is moved to the start of the character class to be literal without escaping.
    const emailRegex = /^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', {
        email: email.trim(),
        name: name.trim(),
      });
      setMessage(response.data.message || 'Thank you for subscribing!');
      setMessageType('success');
      setEmail(''); // Clear email field on success
      setName(''); // Clear name field on success
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to subscribe. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
      console.error('Newsletter subscription error:', axiosError);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  return (
    <div className={`bg-azure text-black p-6 py-10 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-2xl font-bold text-white  text-center mb-4">Subscribe to Our Newsletter</h3>
      <p className="text-center text-white text-lg mb-6 opacity-90">Get the latest updates, articles, and opportunities directly in your inbox!</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Name input field */}
        <div>
          <label htmlFor="newsletter-name" className="sr-only">Your Name</label>
          <input
            id="newsletter-name"
            type="text"
            placeholder="Your Name (Optional)"
            className="w-full p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Your Name for newsletter subscription"
          />
        </div>

        {/* Email input field */}
        <div>
          <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Your Email Address"
            className="w-full p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email for newsletter subscription"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-800 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center gap-2 w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-green-200 rounded-full animate-spin"></div>
          ) : (
            <>
              <FaPaperPlane /> Subscribe
            </>
          )}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${
          messageType === 'success' ? 'text-green-200' : 'text-red-200'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSubscribeForm;