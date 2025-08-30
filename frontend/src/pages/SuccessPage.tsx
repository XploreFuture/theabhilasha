import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";

// ------------------- Types -------------------
interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface User {
  username: string;
  fullName: string;
  email: string;
}

interface Ticket {
  _id: string;
  orderId: string;
  paymentId: string;
  ticketType: string;
  category?: string; // participant category
  amount: number;
  status: string;
  createdAt: string;
  eventId: Event;
  userId: User;
}

// ------------------- Component -------------------
const SuccessPage: React.FC = () => {
  const search = useLocation().search;
  const paymentId = new URLSearchParams(search).get("paymentId");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentId) {
      setError("Payment ID missing in URL.");
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await fetchWithAuth<Ticket>(
          `/api/tickets/ticket/${paymentId}/details`,
          { method: "GET" }
        );
        if (!res) {
          setError("Failed to fetch ticket.");
        } else {
          setTicket(res);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [paymentId]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading ticket details...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!ticket) return <p className="text-center mt-10">Ticket not found.</p>;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('../public/ticket.png')" }} // replace with your ticket background
    >
      <div className="max-w-3xl w-full bg-transparent shadow-2xl rounded-xl p-8">
        {/* Success Message */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-green-600">✅ Payment Successful!</h1>
          <p className="text-lg text-gray-800">Your ticket has been booked successfully. Enjoy the event! 🎫</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-inner border border-gray-300">
          {/* Event Details */}
          <h2 className="text-xl font-semibold mb-2">Event Details</h2>
          <p><strong>Title:</strong> {ticket.eventId?.title || "N/A"}</p>
          <p><strong>Date:</strong> {formatDate(ticket.eventId?.date)}</p>
          <p><strong>Time:</strong> {ticket.eventId?.time || "N/A"}</p>
          <p><strong>Location:</strong> {ticket.eventId?.location || "N/A"}</p>

          <hr className="my-4 border-gray-300" />

          {/* Ticket Details */}
          <h2 className="text-xl font-semibold mb-2">Ticket Details</h2>
          <p><strong>Type:</strong> {ticket.ticketType}</p>
          {ticket.ticketType === "participant" && ticket.category && (
            <p><strong>Category:</strong> {ticket.category}</p>
          )}
          <p><strong>Amount Paid:</strong> ₹{ticket.amount}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Booked On:</strong> {formatDateTime(ticket.createdAt)}</p>

          <hr className="my-4 border-gray-300" />

          {/* User Details */}
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p><strong>Name:</strong> {ticket.userId?.fullName ?? ticket.userId?.username ?? "N/A"}</p>
          <p><strong>Email:</strong> {ticket.userId?.email || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
