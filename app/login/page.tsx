"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setMessage(error.message);
    else setMessage("Account created. Now log in.");
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMessage(error.message);
    else window.location.href = "/create-project";
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-white/10 rounded-[2rem] p-8 bg-white/[0.03]">
        <h1 className="text-4xl font-bold mb-3">Join Speark</h1>
        <p className="text-white/50 mb-8">
          Create an account or log in to add projects.
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 mb-4 outline-none"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 mb-4 outline-none"
        />

        <button
          onClick={login}
          className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium mb-3"
        >
          Log in
        </button>

        <button
          onClick={signUp}
          className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition font-medium"
        >
          Create account
        </button>

        {message && <p className="mt-5 text-sm text-white/50">{message}</p>}
      </div>
    </main>
  );
}