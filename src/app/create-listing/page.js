"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageUploader from "@/components/ImageUploader";

function FieldLabel({ children, required = false }) {
  return (
    <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function CreateListingPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [processing, setProcessing] = useState(false);

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
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  function updateField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch("/api/payments/stripe/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingData: form,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error || "Failed to start payment");
    } catch (error) {
      console.error("Create listing payment error:", error);
      alert("Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="section-wrap">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-4">
              New Listing
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Create Listing
            </h1>

            <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Add product details, upload images, and complete the payment to
              publish your ad on the marketplace.
            </p>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Main Form */}
            <div className="xl:col-span-2 space-y-6">
              <SectionCard
                title="Basic Information"
                subtitle="Enter the main details of your listing."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FieldLabel required>Listing Title</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="e.g. Luxury Sofa Set"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel required>Price</FieldLabel>
                    <input
                      type="number"
                      className="input-ui"
                      placeholder="e.g. 1200"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel required>Category</FieldLabel>
                    <select
                      className="input-ui"
                      value={form.categoryId}
                      onChange={(e) => updateField("categoryId", e.target.value)}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>Condition</FieldLabel>
                    <select
                      className="input-ui"
                      value={form.condition}
                      onChange={(e) => updateField("condition", e.target.value)}
                      required
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Business Name</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="Optional"
                      value={form.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel required>Description</FieldLabel>
                    <textarea
                      className="input-ui min-h-36 resize-none"
                      placeholder="Write a clear description of your listing..."
                      rows="6"
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Seller Information"
                subtitle="How buyers can reach you."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Seller Email</FieldLabel>
                    <input
                      type="email"
                      className="input-ui"
                      placeholder="your@email.com"
                      value={form.sellerEmail}
                      onChange={(e) => updateField("sellerEmail", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel required>Contact Number</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="Phone number"
                      value={form.contactNumber}
                      onChange={(e) => updateField("contactNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel>WhatsApp Number</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="Optional"
                      value={form.whatsappNumber}
                      onChange={(e) => updateField("whatsappNumber", e.target.value)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Location Details"
                subtitle="Help buyers know where the item is available."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FieldLabel>Address</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="Street / area"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Location</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="Area / locality"
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel required>City</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel required>Country</FieldLabel>
                    <input
                      className="input-ui"
                      placeholder="Country"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Listing Images"
                subtitle="Upload high-quality images. The first image will be used as the cover."
              >
                <ImageUploader
                  images={form.images}
                  setImages={(newImages) => updateField("images", newImages)}
                />

                <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Upload multiple images and reorder them if needed.
                </p>
              </SectionCard>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <SectionCard
                  title="Publish Summary"
                  subtitle="Review before continuing to payment."
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Title</span>
                      <span className="font-medium text-gray-900 dark:text-white max-w-[60%] truncate">
                        {form.title || "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Category</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {categories.find((cat) => String(cat.id) === String(form.categoryId))?.name || "Not selected"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Condition</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {form.condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Location</span>
                      <span className="font-medium text-gray-900 dark:text-white max-w-[60%] truncate">
                        {form.city || form.country
                          ? `${form.city}${form.city && form.country ? ", " : ""}${form.country}`
                          : "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Images</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {form.images?.length || 0}
                      </span>
                    </div>
                  </div>
                </SectionCard>

                <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                        Publish Fee
                      </h3>
                      <p className="text-sm text-blue-700/90 dark:text-blue-300/90 mt-1">
                        A one-time payment is required to publish this listing.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-gray-900 px-3 py-2 text-lg font-bold text-blue-600 dark:text-blue-400 shadow-sm">
                      100 AED
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-blue-800 dark:text-blue-200/90">
                    <li>• Secure Stripe checkout</li>
                    <li>• Listing goes live after successful payment</li>
                    <li>• One-time charge per listing</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3.5 text-base font-semibold shadow-lg shadow-blue-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? "Processing..." : "Pay 100 AED & Publish"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}