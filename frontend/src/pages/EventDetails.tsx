import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadRazorpay } from "../utils/loadRazorpay";
import { fetchWithAuth } from "../utils/api";
import type { RazorpayResponse } from "../types/api";

// ------------------- Event Interface -------------------
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participationFee: number;
  audienceFee: number;
  participantTickets: number;
  audienceTickets: number;
  image?: string;
  category:string;
}

// ------------------- User Interface -------------------
interface User {
  fullName: string;
  email: string;
  username: string;
}

// Razorpay typings omitted for brevity (use your existing ones)

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<string>("song");
  const participantCategories = ["song", "story", "shayari", "poem"];

  // ------------------- Fetch Event -------------------
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const data: Event = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event", err);
      }
    };
    fetchEvent();
  }, [id]);

  // ------------------- Fetch Logged-in User -------------------
  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchWithAuth<User>("/api/user/me", { method: "GET" });
      if (data) setUser(data);
    };
    fetchUser();
  }, []);

  // ------------------- Handle Payment -------------------
  const handlePayment = async (amount: number, type: "participant" | "audience") => {
    if (!event || !user) return alert("You must be logged in!");
    
    // Ticket availability
    if ((type === "participant" && event.participantTickets <= 0) ||
        (type === "audience" && event.audienceTickets <= 0)) {
      return alert("Tickets sold out!");
    }

    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay SDK failed to load.");

    try {
      // Create order
      const orderRes = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ amount }),
      });
      const order = await orderRes.json();

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID!,
        amount: order.amount * 100,
        currency: order.currency,
        name: event.title,
        description: `${type === "participant" ? "Participant" : "Audience"} Ticket`,
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          // Verify payment
          const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id,
              ticketType: type,
              amount,
              ...(type === "participant" ? { category } : {}),
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("✅ Payment verified! Downloading ticket...");

            const ticketRes = await fetch(
              `http://localhost:5000/api/payment/ticket/${response.razorpay_payment_id}`,
              { method: "GET", headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            const blob = await ticketRes.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ticket_${event.title}.pdf`;
            link.click();

            navigate(`/success?paymentId=${response.razorpay_payment_id}&eventId=${event._id}`);

            const updatedEventRes = await fetch(`http://localhost:5000/api/events/${event._id}`);
            const updatedEvent: Event = await updatedEventRes.json();
            setEvent(updatedEvent);
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: { name: user.fullName, email: user.email, contact: "9999999999" },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong! Try again.");
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg space-y-6">
      {/* Event Header */}
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-lg border-azure mb-4 shadow" />
      )}
      <div className="flex items-center justify-between">
    <h1 className="text-3xl font-bold">{event.title}</h1>
    {event.category && (
      <span className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-full">
            {event.category}
      </span>
    )}
  </div>
      <p className="text-gray-700">{event.description}</p>
      <p className="text-sm text-gray-500">📍 {event.location}</p>
      <p className="text-sm text-gray-500">📅 {new Date(event.date).toLocaleDateString()} | ⏰ {event.time}</p>

      {/* Ticket Cards */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Participant Ticket */}
        <div className="flex-1 bg-ticket p-4 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
          <h2 className="text-xl text-white font-semibold mb-2">Participant Ticket</h2>
          <p className="mb-2 text-white">Price: ₹{event.participationFee}</p>
          <p className="mb-2 text-white">Available: {event.participantTickets}</p>
          {event.participantTickets > 0 && (
            <div className="mb-2">
              <label className="block mb-1 font-medium text-white">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                {participantCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => handlePayment(event.participationFee, "participant")}
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Participate 
          </button>
        </div>

        {/* Audience Ticket */}
        <div className="flex-1 bg-ticket p-4 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
          <h2 className="text-xl text-white font-semibold mb-2">Audience Ticket</h2>
          <p className="mb-2 text-white">Price: ₹{event.audienceFee}</p>
          <p className="mb-2 text-white">Available: {event.audienceTickets}</p>
          <button
            onClick={() => handlePayment(event.audienceFee, "audience")}
            className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            disabled={event.audienceTickets <= 0}
          >
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
