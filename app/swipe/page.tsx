"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SwipePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      setProjects(data || []);
    }

    loadProjects();
  }, []);

  const project = projects[index];

  function nextProject() {
    if (index < projects.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40">No more projects.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/[0.02]">
          <div className="h-[320px] bg-gradient-to-br from-red-900/40 to-black flex items-center justify-center">
            {project.image_url ? (
              <img
                src={project.image_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-7xl">⚡</div>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-red-400 text-sm uppercase tracking-[0.2em]">
                Project
              </p>

              <div className="px-4 py-2 rounded-full bg-white/10 text-sm">
                Active
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-5">
              {project.title}
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="mb-8">
              <p className="text-white/40 mb-2">
                Looking for
              </p>

              <p className="text-xl">
                {project.looking_for}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {project.tags?.split(",").map((tag: string) => (
                <div
                  key={tag}
                  className="px-4 py-2 rounded-full bg-white/10 text-sm"
                >
                  {tag.trim()}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={nextProject}
                className="h-16 rounded-2xl border border-white/10 hover:bg-white/5 transition"
              >
                Pass
              </button>

              <button
                onClick={nextProject}
                className="h-16 rounded-2xl bg-red-500 hover:bg-red-600 transition font-medium"
              >
                Join Project
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-white/30 mt-8">
          {index + 1} / {projects.length}
        </div>
      </div>
    </main>
  );
}