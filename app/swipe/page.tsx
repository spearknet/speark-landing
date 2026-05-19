"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const demoProjects = [
  {
    id: 0,
    name: "Underground Music Collective",
    category: "Music / Artists",
    lookingFor: "Producers, vocalists, visual artists",
    description: "Connecting unknown artists, producers, and visual creators.",
    tags: ["Music", "Underground", "Artists"],
    members: 4,
    location: "Online",
    owner: "Nova",
  },
];

export default function SwipePage() {
  const [user, setUser] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const [projects, setProjects] = useState<any[]>(demoProjects);
  const [matches, setMatches] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [username, setUsername] = useState("Dr Mikhail");
  const [skill, setSkill] = useState("Founder / Builder");

  const project = projects[index];

  useEffect(() => {
    async function loadData() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) setUser(userData.user);

      const { data, error } = await supabase.from("projects").select("*");

      if (!error && data && data.length > 0) {
        const formatted = data.map((p) => ({
          id: p.id,
          name: p.title,
          category: p.category,
          lookingFor: p.looking_for,
          description: p.description,
          tags: p.tags || [],
          members: Math.floor(Math.random() * 8) + 1,
          location: "Online",
          owner: "Builder",
        }));

        setProjects(formatted);
      }
    }

    loadData();
  }, []);

  function nextProject() {
    setIndex((prev) => (prev + 1) % projects.length);
  }

  async function interested() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    await supabase.from("matches").insert({
      user_id: user.id,
      project_id: project.id,
    });

    setMatches((prev) => [...prev, project.name]);
    setShowMatch(true);
  }

  function closeMatch() {
    setShowMatch(false);
    nextProject();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-5xl flex items-center justify-between mb-10">
        <a href="/" className="text-white/50 hover:text-white transition">
          ← Speark
        </a>

        <div className="flex items-center gap-5 text-sm">
          <a href="/profile" className="text-white/50 hover:text-white transition">
            Profile
          </a>

          <a href="/create-project" className="text-red-500 hover:text-red-400 transition">
            + Add Project
          </a>
        </div>
      </div>

      <section className="w-full max-w-xl">
        <div className="mb-8">
          <p className="text-sm text-red-500 uppercase tracking-[0.25em]">
            Discover Projects
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Swipe into building.
          </h1>
          <p className="mt-3 text-white/50">
            Find projects, artists, developers, and underground creators.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none"
            placeholder="Your name"
          />
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none"
            placeholder="Your skill"
          />
        </div>

        <div className="relative border border-white/10 bg-white/[0.03] rounded-[2rem] p-6 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.18),transparent_35%)]" />

          <div className="relative h-52 rounded-3xl bg-gradient-to-br from-red-700/50 via-white/5 to-black border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
            <div className="absolute w-40 h-40 bg-red-600/20 blur-3xl rounded-full" />
            <span className="relative text-6xl">⚡</span>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-red-400">{project.category}</p>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">
                {project.location}
              </span>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              {project.name}
            </h2>

            <p className="text-white/60 leading-relaxed mb-5">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-white/40">Owner</p>
                <p className="font-medium">{project.owner}</p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-white/40">Team</p>
                <p className="font-medium">{project.members} members</p>
              </div>
            </div>

            <p className="text-sm text-white/40 mb-4">
              Looking for:{" "}
              <span className="text-white/70">{project.lookingFor}</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={nextProject}
                className="py-4 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 transition"
              >
                Pass
              </button>

              <button
                onClick={interested}
                className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium col-span-2"
              >
                Join Project
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-white/40 text-center">
          Matches: {matches.length}
        </div>
      </section>

      {showMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6 z-50">
          <div className="max-w-sm w-full rounded-[2rem] border border-red-500/30 bg-black p-8 text-center shadow-2xl shadow-red-600/20">
            <div className="text-5xl mb-5">⚡</div>
            <h2 className="text-3xl font-bold mb-3">Match request sent.</h2>
            <p className="text-white/60 mb-6">
              {username} wants to join{" "}
              <span className="text-white">{project.name}</span> as{" "}
              <span className="text-red-400">{skill}</span>.
            </p>
            <button
              onClick={closeMatch}
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}