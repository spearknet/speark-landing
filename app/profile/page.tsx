"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
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
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      username,
      skill,
      bio,
	  const { data } = await supabase.auth.getUser();

await supabase.from("profiles").upsert({
  id: data.user.id,
  username,
  bio,
  skills: [skill],
});
    });

    if (error) setMessage(error.message);
    else setMessage("Profile saved.");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-3xl border border-white/10 rounded-[2rem] p-10 bg-white/[0.02]">
        <a href="/swipe" className="text-white/50 hover:text-white transition">
          ← Back to Speark Match
        </a>

        <h1 className="mt-10 text-6xl font-bold tracking-tight">
          Your profile
        </h1>

        <p className="mt-5 text-white/50 text-xl">
          Tell others who you are and what you build.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name"
            className="bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-6 text-2xl outline-none"
          />

          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Skill / role"
            className="bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-6 text-2xl outline-none"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            rows={5}
            className="bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-6 text-xl outline-none resize-none"
          />

          <button
            onClick={saveProfile}
            className="bg-red-600 hover:bg-red-500 transition rounded-3xl py-6 text-2xl font-medium"
          >
            Save profile
          </button>

          {message && (
            <p className="text-white/50 text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}