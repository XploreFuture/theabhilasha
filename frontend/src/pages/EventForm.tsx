import { useState } from "react";
import type { Event } from "../types/api";

export default function AddEvent() {
  const [form, setForm] = useState<Event & {
    time: string;
    participantTickets: number;
    audienceTickets: number;
    category: string;
  }>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    participationFee: 0,
    audienceFee: 0,
    participantTickets: 0,
    audienceTickets: 0,
    image: "",
    category: "Open Mic", // default category
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name.includes("Fee") || name.includes("Tickets") ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // Reset form
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      participationFee: 0,
      audienceFee: 0,
      participantTickets: 0,
      audienceTickets: 0,
      image: "",
      category: "Open Mic",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow p-6 rounded-xl space-y-4"
    >
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Event Image URL</label>
        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Enter image URL"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Open Mic">Open Mic</option>
          <option value="Puppet Show">Puppet Show</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Event Description"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Time</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Event Location"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Participation Fee (₹)</label>
        <input
          type="number"
          name="participationFee"
          value={form.participationFee}
          onChange={handleChange}
          placeholder="Participation Fee"
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Audience Fee (₹)</label>
        <input
          type="number"
          name="audienceFee"
          value={form.audienceFee}
          onChange={handleChange}
          placeholder="Audience Fee"
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Number of Participant Tickets</label>
        <input
          type="number"
          name="participantTickets"
          value={form.participantTickets}
          onChange={handleChange}
          placeholder="Participant Tickets"
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Number of Audience Tickets</label>
        <input
          type="number"
          name="audienceTickets"
          value={form.audienceTickets}
          onChange={handleChange}
          placeholder="Audience Tickets"
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add Event
      </button>
    </form>
  );
}
