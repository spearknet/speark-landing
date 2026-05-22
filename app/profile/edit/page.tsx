"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [skill, setSkill] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [x, setX] = useState("");
  const [github, setGithub] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUserId(data.user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setUsername(profile.username || "");
        setSkill(profile.skill || "");
        setBio(profile.bio || "");
        setWebsite(profile.website || "");
        setInstagram(profile.instagram || "");
        setX(profile.x || "");
        setGithub(profile.github || "");
        setAvatarUrl(profile.avatar_url || "");
      }
    }

    loadProfile();
  }, []);

  async function uploadAvatar(file: File) {
    if (!userId) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) {
      setMessage(error.message);
      return;
    }

    const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

    setAvatarUrl(data.publicUrl);
  }

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
      website,
      instagram,
      x,
      github,
      avatar_url: avatarUrl,
    });

    if (error) setMessage(error.message);
    else setMessage("Profile saved.");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto border border-white/10 rounded-[2rem] p-8 bg-white/[0.02]">
        <h1 className="text-5xl font-bold mb-3">My profile</h1>
        <p className="text-white/50 mb-10">
          Your public Speark identity.
        </p>

        <div className="flex items-center gap-6 mb-10">
          <div className="w-28 h-28 rounded-full bg-white/10 overflow-hidden border border-white/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {username?.[0] || "S"}
              </div>
            )}
          </div>

          <label className="cursor-pointer px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition">
            Upload avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
            />
          </label>
        </div>

        <div className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Skill / role"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full min-h-36 bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none"
          />

          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="Instagram"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="X / Twitter"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="GitHub"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            onClick={saveProfile}
            className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium"
          >
            Save profile
          </button>

          {message && <p className="text-white/50">{message}</p>}
        </div>
      </div>
    </main>
  );
}