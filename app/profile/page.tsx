"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [skill, setSkill] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setMessage("Please log in first.");
        return;
      }

      setUserId(userData.user.id);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (data) {
        setUsername(data.username || "");
        setSkill(data.skill || "");
        setBio(data.bio || "");
      }
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    if (!userId) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username,
      skill,
      bio,
    });

    if (error) setMessage(error.message);
    else setMessage("Profile saved.");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl border border-white/10 rounded-[2rem] p-8 bg-white/[0.03]">
        <a href="/swipe" className="text-white/40 text-sm">
          ← Back to Speark Match
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-3">Your profile</h1>
        <p className="text-white/50 mb-8">
          Tell others who you are and what you build.
        </p>

        <div className="space-y-4">
          <input
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none"
            placeholder="Skill / role"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />

          <textarea
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none min-h-32"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button
            onClick={saveProfile}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium"
          >
            Save profile
          </button>
        </div>

        {message && <p className="mt-5 text-sm text-white/50">{message}</p>}
      </div>
    </main>
  );
}