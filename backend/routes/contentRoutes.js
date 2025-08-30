// routes/contentRoutes.js
import express from "express";
import Content from "../models/Content.js";
import protect from "../middlewares/authMiddleware.js"; // optional: only logged-in users can add content

const router = express.Router();

// ✅ Add new content
router.post("/add", protect, async (req, res) => {
  try {
    const { type,imageurl, title, sections, author } = req.body;

    if (!type || !title || !sections) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const newContent = await Content.create({ type,imageurl, title, sections, author, slug });
    res.json({ success: true, content: newContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add content" });
  }
});

// ✅ Get all content
router.get("/", async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch content" });
  }
});

// ✅ Get single content by slug
router.get("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Error fetching content" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { title,imageurl, category, sections, images } = req.body;

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { title, category, sections, images, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Error updating content" });
  }
});

export default router;
