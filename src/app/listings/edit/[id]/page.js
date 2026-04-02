"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imageInput, setImageInput] = useState("");
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

  useEffect(() => {
    async function loadData() {
      try {
        const [listingRes, categoriesRes] = await Promise.all([
          fetch(`/api/listings/${id}`),
          fetch("/api/categories"),
        ]);

        const listingData = await listingRes.json();
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

        setCategories(categoriesData);

        if (listingRes.ok) {
          setForm({
            title: listingData.title || "",
            description: listingData.description || "",
            price: String(listingData.price || ""),
            categoryId: String(listingData.categoryId || ""),
            condition: listingData.condition || "Used",
            businessName: listingData.businessName || "",
            sellerEmail: listingData.sellerEmail || "",
            contactNumber: listingData.contactNumber || "",
            whatsappNumber: listingData.whatsappNumber || "",
            address: listingData.address || "",
            location: listingData.location || "",
            city: listingData.city || "",
            country: listingData.country || "",
            images: (listingData.images || []).map((img) => img.imageUrl),
          });
        } else {
          alert(listingData.error || "Failed to load listing");
          router.push("/dashboard");
        }
      } catch (error) {
        alert("Failed to load listing");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id, router]);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`/api/listings/${id}`, {
      method: "PUT",
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
      router.push(`/listings/${id}`);
    } else {
      alert(data.error || "Failed to update listing");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
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
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
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

          <div className="md:col-span-2">
            <input
              className="border p-3 rounded w-full"
              placeholder="Paste image URL and click Add Image"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />

            <button
              type="button"
              className="mt-2 bg-gray-800 text-white px-4 py-2 rounded"
              onClick={() => {
                if (!imageInput.trim()) return;
                setForm({
                  ...form,
                  images: [...form.images, imageInput],
                });
                setImageInput("");
              }}
            >
              Add Image
            </button>

            <div className="mt-3 flex flex-wrap gap-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6"
                    onClick={() =>
                      setForm({
                        ...form,
                        images: form.images.filter((_, index) => index !== i),
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded">
            Update Listing
          </button>
        </form>
      </div>
    </>
  );
}