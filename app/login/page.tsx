"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Forkert e-mail eller adgangskode");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] text-[#222] font-[Poppins,sans-serif]">
      <div className="bg-white border border-[#e2e6ea] rounded-2xl shadow-md p-10 w-[380px] flex flex-col items-center">
        {/* Tryg logo */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tryg_logo.svg/1200px-Tryg_logo.svg.png"
          alt="Tryg logo"
          className="w-[120px] mb-6"
        />

        <h1 className="text-[22px] font-semibold text-[#e60000] mb-8 text-center">
          Tryg Samligning
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#d5d8dc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e60000] text-[15px]"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Adgangskode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#d5d8dc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e60000] text-[15px]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e60000] hover:bg-[#b30000] text-white font-medium py-2 rounded-md transition duration-200"
          >
            {loading ? "Logger ind..." : "Log ind"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          © 2025 Tryg Forsikring – Insurence Tech
        </p>
      </div>
    </div>
  );
}
