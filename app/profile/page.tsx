"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
setName(data.username || "");
setRole(data.skill || "");
      setBio(data.bio || "");
    }
  }

  async function saveProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please log in first.");
    return;
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: name,
    skill: role,
    bio,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profile saved.");
}

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
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

        <p className="mt-5 text-white/50 text-xl">
          Tell others who you are and what you build.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-6 text-2xl outline-none"
          />

          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
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

          {saved && (
            <p className="text-green-400 text-center">
              Profile saved successfully.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}