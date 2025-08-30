// frontend/src/pages/UserTickets.tsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

interface Ticket {
  _id: string;
  eventName: string;
  paymentId: string; // use paymentId to download PDF
  orderId: string;
  ticketType: "participant" | "audience"; // new
  amount: number;
  date: string;
}

const UserTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------- Fetch user tickets -------------------
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await fetchWithAuth<Ticket[]>("/api/tickets/my-tickets", { method: "GET" });
        if (data) setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Failed to load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // ------------------- Handle PDF download -------------------
  const handleDownload = async (paymentId: string, eventName: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return alert("You are not logged in.");

      const res = await fetch(`http://localhost:5000/api/tickets/ticket/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        return alert("Failed to download ticket.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket_${eventName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download ticket. Please try again.");
    }
  };

  // ------------------- Render UI -------------------
  if (loading) return <p>Loading your tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tickets.length) return <p>No tickets found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      <ul className="space-y-4">
        {tickets.map((ticket) => (
          <li key={ticket._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{ticket.eventName}</p>
              <p className="text-sm text-gray-500">Type: {ticket.ticketType}</p>
              <p className="text-sm text-gray-500">Amount: ₹{ticket.amount}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(ticket.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDownload(ticket.paymentId, ticket.eventName)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Ticket
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserTickets;
