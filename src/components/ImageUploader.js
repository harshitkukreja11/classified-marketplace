"use client";

import { useRef, useState } from "react";

export default function ImageUploader({ images = [], setImages }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const base64 = await fileToBase64(file);

        const res = await fetch("/api/uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: base64 }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Upload API error:", data);
          alert(data.details || data.error || "Upload failed");
          continue;
        }

        uploadedUrls.push(data.url);
      }

      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Uploader error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  return (
    <div className="md:col-span-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50"
      >
        <p>Drag & drop images</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploading && <p className="mt-2">Uploading...</p>}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              alt={`Uploaded ${i + 1}`}
              className="w-full h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}