"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="max-w-md mx-auto">

      <h1 className="text-2xl mb-4">Login</h1>

      <form onSubmit={handleLogin} className="space-y-3">

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 border"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white p-2 w-full">
          Login
        </button>

      </form>

    </div>
  );
}