// models/Gallery.ts
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const GallerySchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // URL or path of image
  createdAt: { type: Date, default: Date.now },
});

export default model("Gallery", GallerySchema);
