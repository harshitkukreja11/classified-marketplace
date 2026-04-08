"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageUploader from "@/components/ImageUploader";
import Link from "next/link";

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

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  function updateField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
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
    } catch (error) {
      alert("Something went wrong while updating");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="section-wrap">
          <div className="card-ui p-6 text-center text-gray-500 dark:text-gray-400">
            Loading listing details...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="section-wrap">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-4">
                Edit Listing
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Update Listing
              </h1>

              <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Edit your listing information, update images, and keep your ad details accurate.
              </p>
            </div>

            <Link href="/dashboard" className="btn-secondary text-center">
              Back to Dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left */}
            <div className="xl:col-span-2 space-y-6">
              <SectionCard
                title="Basic Information"
                subtitle="Update the main details of your listing."
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
                subtitle="Update the contact information buyers will use."
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
                subtitle="Keep the location accurate for better buyer trust."
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
                subtitle="Reorder or replace images. The first image is used as the cover."
              >
                <ImageUploader
                  images={form.images}
                  setImages={(newImages) => updateField("images", newImages)}
                />

                <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Upload multiple images and arrange them to control the listing cover.
                </p>
              </SectionCard>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <SectionCard
                  title="Listing Summary"
                  subtitle="Quick preview of the updated information."
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Title</span>
                      <span className="font-medium text-gray-900 dark:text-white max-w-[60%] truncate">
                        {form.title || "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Price</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {form.price ? `AED ${form.price}` : "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Category</span>
                      <span className="font-medium text-gray-900 dark:text-white max-w-[60%] truncate">
                        {categories.find((cat) => String(cat.id) === String(form.categoryId))?.name ||
                          "Not selected"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Condition</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {form.condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Location</span>
                      <span className="font-medium text-gray-900 dark:text-white max-w-[60%] truncate">
                        {form.city || form.country
                          ? `${form.city}${form.city && form.country ? ", " : ""}${form.country}`
                          : "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Images</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {form.images?.length || 0}
                      </span>
                    </div>
                  </div>
                </SectionCard>

                <div className="rounded-2xl border border-yellow-200 dark:border-yellow-900 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/20 p-5 shadow-sm">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                    Editing Tips
                  </h3>

                  <ul className="mt-3 space-y-2 text-sm text-yellow-800 dark:text-yellow-200/90">
                    <li>• Keep the title clear and specific</li>
                    <li>• Use quality images for better engagement</li>
                    <li>• Make sure contact details are correct</li>
                    <li>• Update price and location accurately</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3.5 text-base font-semibold shadow-lg shadow-blue-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Updating..." : "Update Listing"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}