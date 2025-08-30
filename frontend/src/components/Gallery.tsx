import React, { useEffect, useState } from "react";
import axios from "axios";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/gallery").then((res) => setImages(res.data));
  }, []);

  return (
    <div className="p-8 bg-transparent">
      <h2 className="text-2xl font-bold text-center mb-6">Event Gallery</h2>

      {/* Parent with perspective */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
        {images.map((item) => (
          <div
            key={item._id}
            className=" bg-azure relative rounded-lg overflow-hidden shadow-lg transform-gpu transition-transform duration-500 hover:scale-105 hover:rotate-y-6 hover:shadow-2xl cursor-pointer"
          >
            {/* Inner card with 3D transform */}
            <div className="w-full h-60 transform-gpu transition-transform duration-500 hover:rotate-y-12">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="p-2 text-white text-center font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
