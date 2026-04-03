"use client";

import { useState } from "react";

export default function ListingGallery({ images = [], title = "Listing image" }) {
  const safeImages =
    images.length > 0
      ? images
      : [{ id: "placeholder", imageUrl: "https://via.placeholder.com/900x600" }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const selectedImage = safeImages[selectedIndex]?.imageUrl || safeImages[0].imageUrl;

  function goPrev() {
    setSelectedIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  }

  function goNext() {
    setSelectedIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <>
      <div>
        <div className="relative bg-white rounded-2xl overflow-hidden shadow">
          <img
            src={selectedImage}
            alt={title}
            className="w-full h-96 md:h-[500px] object-cover cursor-zoom-in"
            onClick={() => setOpen(true)}
          />

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full"
              >
                ›
              </button>

              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {selectedIndex + 1} / {safeImages.length}
              </div>
            </>
          )}
        </div>

        {safeImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-4">
            {safeImages.map((img, index) => (
              <button
                key={img.id || index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`border rounded-xl overflow-hidden ${
                  selectedIndex === index
                    ? "ring-2 ring-blue-600 border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ×
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              >
                ›
              </button>
            </>
          )}

          <img
            src={selectedImage}
            alt={title}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
          />
        </div>
      )}
    </>
  );
}