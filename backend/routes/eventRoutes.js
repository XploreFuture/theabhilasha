import { Router } from "express";
import Event from "../models/Event.js";

const router = Router();

// Create event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: "Failed to create event" });
  }
});

// Get all events
router.get("/", async (_req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});
// Get single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Update event by ID
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: "Failed to update event" });
  }
});

router.delete("/delete-expired", async (req, res) => {
  try {
    const now = new Date();
    const result = await Event.deleteMany({ date: { $lt: now } });
    res.json({ message: "Expired events deleted", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expired events" });
  }
});
export default router;
