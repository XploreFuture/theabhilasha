// models/Content.js
import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["shayari", "poem", "story", "article"],
    required: true,
  },
  title: { type: String, required: true },
  imageurl: {type: String},
  slug: { type: String, unique: true }, // For SEO-friendly URLs
  sections: [
    {
      heading: { type: String },
      content: { type: String },      // Can be long text or HTML
      image: { type: String },        // URL of uploaded image (optional)
    },
  ],
  author: { type: String },           // Optional author
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Content", contentSchema);
