import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/api";

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Event & {
    time: string;
    participantTickets: number;
    audienceTickets: number;
  } | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then(res => res.json())
      .then(data => setForm(data));
  }, [id]);

  if (!form) return <p className="text-center mt-6">Loading event...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name.includes("Fee") || name.includes("Tickets") ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    navigate(`/events/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow p-6 rounded-xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border rounded"
        required
      />
      
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        name="date"
        value={form.date.split("T")[0]}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        name="participationFee"
        value={form.participationFee}
        onChange={handleChange}
        placeholder="Participation Fee"
        className="w-full p-2 border rounded"
        min="0"
      />

      <input
        type="number"
        name="audienceFee"
        value={form.audienceFee}
        onChange={handleChange}
        placeholder="Audience Fee"
        className="w-full p-2 border rounded"
        min="0"
      />

      <input
        type="number"
        name="participantTickets"
        value={form.participantTickets}
        onChange={handleChange}
        placeholder="Number of Participant Tickets"
        className="w-full p-2 border rounded"
        min="0"
      />

      <input
        type="number"
        name="audienceTickets"
        value={form.audienceTickets}
        onChange={handleChange}
        placeholder="Number of Audience Tickets"
        className="w-full p-2 border rounded"
        min="0"
      />

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
        Save Changes
      </button>
    </form>
  );
}
