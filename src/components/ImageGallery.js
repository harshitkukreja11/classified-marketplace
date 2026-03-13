"use client";

import { useState } from "react";

export default function ImageGallery({ images }) {

  const [activeImage, setActiveImage] = useState(images?.[0]);

  return (
    <div>

      {/* MAIN IMAGE */}
      <img
        src={activeImage || "/placeholder.png"}
        className="w-full h-96 object-cover rounded-lg"
      />

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-4">

        {images?.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => setActiveImage(img)}
            className={`w-24 h-24 object-cover rounded cursor-pointer border
              ${activeImage === img ? "border-blue-600" : "border-gray-300"}
            `}
          />
        ))}

      </div>

    </div>
  );
}