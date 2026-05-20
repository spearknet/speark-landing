"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  async function uploadProjectImage(file: File) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `projects/${userData.user.id}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) {
      setMessage(error.message);
      return;
    }

    const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setMessage("Image uploaded.");
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
      image_url: imageUrl,
      owner_id: userData.user.id,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Project created.");
    setTitle("");
    setCategory("");
    setDescription("");
    setLookingFor("");
    setTags("");
    setImageUrl("");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto border border-white/10 rounded-[2rem] p-8 bg-white/[0.02]">
        <h1 className="text-5xl font-bold mb-3">Create project</h1>

        <p className="text-white/50 mb-10">
          Add your project to Speark.
        </p>

        <div className="space-y-5">
          <label className="block cursor-pointer border border-white/10 rounded-3xl overflow-hidden bg-white/[0.03]">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-72 object-cover"
                alt="project"
              />
            ) : (
              <div className="h-72 flex items-center justify-center text-white/40">
                Upload project image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadProjectImage(file);
              }}
            />
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project name"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            className="w-full min-h-36 bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none"
          />

          <input
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            placeholder="Looking for"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags separated by comma"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            onClick={createProject}
            className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium"
          >
            Create project
          </button>

          {message && <p className="text-white/50">{message}</p>}
        </div>
      </div>
    </main>
  );
}