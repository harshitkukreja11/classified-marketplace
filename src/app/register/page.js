"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(data.error || "Registration failed");
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            className="w-full border p-3 rounded"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={form.password}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full border p-3 rounded"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            className="w-full border p-3 rounded"
            value={form.location}
            onChange={handleChange}
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </>
  );
}