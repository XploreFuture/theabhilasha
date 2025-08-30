// routes/galleryRoute.ts
import express from "express";
import Gallery from "../models/Gallery.js";

const router = express.Router();

// Add new gallery image
router.post("/", async (req, res) => {
  try {
    const { title, image } = req.body;
    const newImage = new Gallery({ title, image });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: "Failed to add gallery image" });
  }
});

// Get all gallery images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

export default router;
