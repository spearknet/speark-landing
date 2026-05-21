"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const groups = [
  "All Projects",
  "Creators Projects",
  "Developers Projects",
  "Artists Projects",
  "Entrepreneurs Projects",
  "Builders Projects",
  "Other Projects",
];

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState("All Projects");
  const [search, setSearch] = useState("");

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

  const filteredProjects = projects.filter((project) => {
    const matchesGroup =
      activeGroup === "All Projects" || project.category === activeGroup;

    const matchesSearch =
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase());

    return matchesGroup && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 max-w-7xl mx-auto">
        <aside className="space-y-4">
          <div className="text-xl font-bold tracking-wide mb-8">Projects:</div>

          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition ${
                activeGroup === group
                  ? "border-red-500/40 bg-red-500/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                ▲
              </span>
              <span className="text-sm font-medium text-left">{group}</span>
            </button>
          ))}

          <div className="pt-8">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />
          </div>

          <div className="mt-20 border border-white/10 rounded-3xl p-6 bg-white/[0.03]">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 mb-5" />
            <h3 className="text-xl font-bold mb-2">For Members</h3>
            <p className="text-white/50 mb-6">
              Join a community of builders.
            </p>
<a
  href="https://discord.gg/8B8rjHv8vE"
  target="_blank"
  className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition"
>
  Join
</a>
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Push Your Project.
              </h1>
              <p className="text-white/50 text-lg">
                A social network for creators, developers, artists,
                entrepreneurs, and builders.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="/create-project"
                className="px-6 py-4 rounded-2xl border border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Add Project
              </a>
              <a
                href="/swipe"
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15"
              >
                Match
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <a
                key={project.id}
                href="/swipe"
                className="group block"
              >
                <div className="h-56 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      ⚡
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h2 className="text-xl font-bold">{project.title}</h2>
                    <p className="text-white/40 text-sm mt-1">
                      {project.category}
                    </p>
                  </div>

                  <span className="text-2xl text-white/60">↗</span>
                </div>
              </a>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p className="text-white/40 mt-20">No projects found.</p>
          )}
        </section>
      </div>
    </main>
  );
}