"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageUploader from "@/components/ImageUploader";

export default function CreateListingPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    condition: "Used",
    businessName: "",
    sellerEmail: "",
    contactNumber: "",
    whatsappNumber: "",
    address: "",
    location: "",
    city: "",
    country: "",
    images: [],
  });

  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      router.push(`/listings/${data.id}`);
    } else {
      alert(data.error || "Failed to create listing");
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Create Listing</h1>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <select
  className="border p-3 rounded"
  value={form.categoryId}
  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
>
  <option value="">Select category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

          <select
            className="border p-3 rounded"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>

          <input
            className="border p-3 rounded"
            placeholder="Business Name"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Seller Email"
            value={form.sellerEmail}
            onChange={(e) => setForm({ ...form, sellerEmail: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="WhatsApp Number"
            value={form.whatsappNumber}
            onChange={(e) =>
              setForm({ ...form, whatsappNumber: e.target.value })
            }
          />

          <input
            className="border p-3 rounded"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />

          <textarea
            className="border p-3 rounded md:col-span-2"
            placeholder="Description"
            rows="5"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

         <ImageUploader
  images={form.images}
  setImages={(newImages) => setForm({ ...form, images: newImages })}
/>
          <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded">
            Publish Listing
          </button>
        </form>
      </div>
    </>
  );
}