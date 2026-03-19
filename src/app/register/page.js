"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto">

      <h1 className="text-2xl mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input placeholder="Name" required
          onChange={(e)=>setForm({...form,name:e.target.value})}
          className="w-full p-2 border"
        />

        <input placeholder="Email" required
          onChange={(e)=>setForm({...form,email:e.target.value})}
          className="w-full p-2 border"
        />

        <input type="password" placeholder="Password" required
          onChange={(e)=>setForm({...form,password:e.target.value})}
          className="w-full p-2 border"
        />

        <button className="bg-blue-600 text-white p-2 w-full">
          Register
        </button>

      </form>

    </div>
  );
}