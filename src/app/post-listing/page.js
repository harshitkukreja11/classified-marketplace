"use client";

import { useState } from "react";

export default function PostListing() {

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImages = (e) => {

    const files = Array.from(e.target.files);

    if (files.length > 10) {
      alert("Max 10 images allowed");
      return;
    }

    setImages(files);

    const previewUrls = files.map(file =>
      URL.createObjectURL(file)
    );

    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const uploadedUrls = [];

      // Upload images
      for (let image of images) {

        const formData = new FormData();
        formData.append("file", image);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (!data.url) {
          alert("Image upload failed");
          return;
        }

        uploadedUrls.push(data.url);
      }

      // Save listing
      const listingRes = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          price,
          description,
          images: uploadedUrls
        })
      });

      const listing = await listingRes.json();

      console.log("Saved listing:", listing);

      alert("Listing created successfully!");

      // reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setImages([]);
      setPreviews([]);

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-4"
    >

      {/* Title */}
      <input
        type="text"
        placeholder="Listing title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        rows="4"
      />

      {/* Image Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImages}
      />

      {/* Preview Images */}
      <div className="grid grid-cols-3 gap-4">

        {previews.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-32 object-cover rounded"
          />
        ))}

      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload Listing
      </button>

    </form>

  );
}