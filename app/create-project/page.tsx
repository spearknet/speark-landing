"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const groups = [
  "Creators Projects",
  "Developers Projects",
  "Artists Projects",
  "Entrepreneurs Projects",
  "Builders Projects",
  "Other Projects",
];

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Creators Projects");
  const [description, setDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  async function uploadImages(files: FileList) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const selected = Array.from(files).slice(0, 10 - imageUrls.length);

    for (const file of selected) {
      const fileExt = file.name.split(".").pop();
      const filePath = `projects/${userData.user.id}-${Date.now()}-${file.name}.${fileExt}`;

      const { error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (error) {
        setMessage(error.message);
        return;
      }

      const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setImageUrls((prev) => [...prev, data.publicUrl].slice(0, 10));
    }

    setMessage("Images uploaded.");
  }

  async function createProject() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("projects").insert({
      title,
      category,
      description,
      looking_for: lookingFor,
      tags: tags.split(",").map((tag) => tag.trim()),
      image_url: imageUrls[0] || "",
      image_urls: imageUrls,
      owner_id: userData.user.id,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto border border-white/10 rounded-[2rem] p-8 bg-white/[0.02]">
        <h1 className="text-5xl font-bold mb-3">Add Project</h1>
        <p className="text-white/50 mb-10">Upload up to 10 images.</p>

        <div className="space-y-5">
          <label className="block cursor-pointer border border-white/10 rounded-3xl overflow-hidden bg-white/[0.03]">
            <div className="h-72 flex items-center justify-center text-white/40">
              Upload project images
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) uploadImages(e.target.files);
              }}
            />
          </label>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {imageUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  className="h-24 w-full object-cover rounded-xl border border-white/10"
                />
              ))}
            </div>
          )}

          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project name" className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none" />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none">
            {groups.map((group) => <option key={group}>{group}</option>)}
          </select>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" className="w-full min-h-36 bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none" />

          <input value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} placeholder="Looking for" className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none" />

          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags separated by comma" className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none" />

          <button onClick={createProject} className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium">
            Add Project
          </button>

          {message && <p className="text-white/50">{message}</p>}
        </div>
      </div>
    </main>
  );
}