"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [username, setUsername] = useState("Mr Mikhail");
  const [skill, setSkill] = useState("Founder / Builder");
  const [bio, setBio] = useState(
    "Building Speark — a place to find people for projects."
  );

  const [message, setMessage] = useState("");

  async function saveProfile() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: data.user.id,
      username,
      skill,
      bio,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile saved.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-3xl border border-white/10 rounded-[2rem] p-10 bg-white/[0.02]">
        <a
          href="/swipe"
          className="text-white/50 hover:text-white transition"
        >
          ← Back to Speark Match
        </a>

        <h1 className="mt-10 text-6xl font-bold tracking-tight">
          Your profile
        </h1>

        <p className="mt-4 text-white/50 text-xl">
          Tell others who you are and what you build.
        </p>

        <div className="mt-10 space-y-6">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-8 py-6 text-2xl outline-none"
          />

          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Your skill"
            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-8 py-6 text-2xl outline-none"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full h-64 resize-none bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-8 py-6 text-2xl outline-none"
          />

          <button
            onClick={saveProfile}
            className="w-full py-6 rounded-[1.5rem] bg-red-600 hover:bg-red-500 transition text-2xl font-medium"
          >
            Save profile
          </button>

          {message && (
            <p className="text-center text-white/50 text-lg">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}