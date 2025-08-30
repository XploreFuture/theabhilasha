// src/pages/Events.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Event } from "../types/api";

const getEvents = async (): Promise<Event[]> => {
  try {
    const res = await fetch("http://localhost:5000/api/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch {
    return [];
  }
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Upcoming Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">No events available</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 perspective-1500">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-gradient-to-br from-fuck from-30% via-me via-80% border border-black rounded-2xl shadow-xl transform transition duration-500 hover:scale-105 hover:rotate-x-3 hover:rotate-y-3 hover:shadow-2xl cursor-pointer"
              style={{ perspective: 1500 }}
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={event.image || "/images/event-default.jpg"}
                  alt={event.title}
                  className="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h2 className="text-2xl text-black font-semibold mb-2 text-gray-900">
                  {event.title}
                </h2>
                <p className="text-black  mb-1">
<strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}
                </p>
                <p className="text-black  mb-2">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-black  line-clamp-3 mb-4">
                  {event.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-black  space-y-1">
                    <p>Participation: ₹{event.participationFee}</p>
                    <p>Audience: ₹{event.audienceFee}</p>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-indigo-600 hover:to-blue-500 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
