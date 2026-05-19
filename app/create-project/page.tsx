"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  async function createProject() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("projects").insert({
      owner: userData.user.id,
      title,
      category,
      description,
      looking_for: lookingFor,
      tags: tags.split(",").map((tag) => tag.trim()),
    });

    if (error) setMessage(error.message);
    else {
      setMessage("Project created.");
      setTitle("");
      setCategory("");
      setDescription("");
      setLookingFor("");
      setTags("");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl border border-white/10 rounded-[2rem] p-8 bg-white/[0.03]">
        <a href="/swipe" className="text-white/40 text-sm">
          ← Back to Speark Match
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-3">Create project</h1>
        <p className="text-white/50 mb-8">
          Add your project and find people to build with.
        </p>

        <div className="space-y-4">
          <input className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none" placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <textarea className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none min-h-32" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none" placeholder="Looking for" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} />
          <input className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 outline-none" placeholder="Tags separated by comma" value={tags} onChange={(e) => setTags(e.target.value)} />

          <button onClick={createProject} className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium">
            Create project
          </button>
        </div>

        {message && <p className="mt-5 text-sm text-white/50">{message}</p>}
      </div>
    </main>
  );
}