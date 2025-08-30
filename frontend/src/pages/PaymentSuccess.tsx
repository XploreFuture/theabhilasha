import React from "react";
import { useNavigate } from "react-router-dom";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
declare const window: Window;

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    const options: RazorpayOptions = {
      key: "YOUR_RAZORPAY_KEY_ID", // replace with your Razorpay key
      amount: 50000, // Example ₹500 in paise
      currency: "INR",
      name: "Event Ticket",
      description: "Checkout for Event Ticket",
      handler: (response: RazorpayResponse) => {
        // redirect to success page with paymentId
        navigate(`/success?paymentId=${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p className="mb-6">Complete your payment to get your event ticket.</p>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Pay ₹500
      </button>
    </div>
  );
};

export default Checkout;
