"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SwipePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setProjects(data || []);
      setLoading(false);
    }

    loadProjects();
  }, []);

  const project = projects[index];

  function nextProject() {
    setMessage("");

    if (index < projects.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(projects.length);
    }
  }

  async function sparkProject() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("project_sparks").insert({
      user_id: userData.user.id,
      project_id: project.id,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Sparked.");
  }

  async function joinProject() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("project_requests").insert({
      user_id: userData.user.id,
      project_id: project.id,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Request sent.");
    setTimeout(nextProject, 800);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        No projects.
      </main>
    );
  }

  const images =
    project.image_urls?.length > 0
      ? project.image_urls
      : project.image_url
      ? [project.image_url]
      : [];

  const tags = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === "string"
    ? project.tags.split(",")
    : [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/[0.02]">
        <div className="h-[320px] bg-white/[0.03] flex items-center justify-center">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-7xl">⚡</div>
          )}
        </div>

        <div className="p-8">
          <p className="text-red-400 uppercase tracking-[0.2em] text-sm mb-4">
            {project.category || "Project"}
          </p>

          <h1 className="text-5xl font-bold mb-5">{project.title}</h1>

          <p className="text-white/70 text-lg mb-8">{project.description}</p>

          <p className="text-white/40 mb-2">Looking for</p>
          <p className="text-xl mb-8">{project.looking_for}</p>

          <div className="flex flex-wrap gap-3 mb-10">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-white/10 text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={nextProject}
              className="h-16 rounded-2xl border border-white/10 hover:bg-white/5 transition"
            >
              Pass
            </button>

            <button
              onClick={sparkProject}
              className="h-16 rounded-2xl bg-white text-black font-medium hover:bg-white/90 transition"
            >
              ⚡ Spark
            </button>

            <button
              onClick={joinProject}
              className="h-16 rounded-2xl bg-red-500 hover:bg-red-600 transition font-medium"
            >
              Join
            </button>
          </div>

          {message && (
            <p className="mt-5 text-center text-white/50">{message}</p>
          )}

          <p className="text-center text-white/30 mt-8">
            {index + 1} / {projects.length}
          </p>
        </div>
      </div>
    </main>
  );
}