// components/GalleryForm.tsx
import React, { useState } from "react";
import axios from "axios";

const GalleryForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/gallery", { title, image });
      alert("Image added successfully!");
      setTitle("");
      setImage("");
    } catch (err) {
      console.error(err);
      alert("Failed to add image");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Add Gallery Image</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Add Image
      </button>
    </form>
  );
};

export default GalleryForm;
