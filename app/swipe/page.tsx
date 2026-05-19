"use client";

import { useState } from "react";

const projects = [
  {
    name: "Underground Music Collective",
    category: "Music / Artists",
    lookingFor: "Producers, vocalists, visual artists",
    description:
      "A dark underground music project connecting unknown artists, producers, and visual creators.",
    tags: ["Music", "Underground", "Artists"],
    members: 4,
    location: "Online",
    owner: "Nova",
  },
  {
    name: "AI Streetwear Brand",
    category: "Fashion / AI",
    lookingFor: "Designers, marketers, creators",
    description:
      "A futuristic streetwear brand powered by AI concepts, limited drops, and underground culture.",
    tags: ["Fashion", "AI", "Brand"],
    members: 2,
    location: "Europe",
    owner: "Kairo",
  },
  {
    name: "Cyber Indie Game",
    category: "Game Dev",
    lookingFor: "Developers, pixel artists, sound designers",
    description:
      "An indie game inspired by cyberpunk worlds, survival mechanics, and underground storytelling.",
    tags: ["GameDev", "Art", "Coding"],
    members: 5,
    location: "Remote",
    owner: "PixelForge",
  },
];

export default function SwipePage() {
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState("");

  const project = projects[index];

  function nextProject(action: string) {
    setLastAction(action);
    setIndex((prev) => (prev + 1) % projects.length);
  }

  function interested() {
    setMatches((prev) => [...prev, project.name]);
    nextProject("Interested");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-5xl flex items-center justify-between mb-10">
        <a href="/" className="text-white/50 hover:text-white transition">
          ← Speark
        </a>

        <p className="text-white/40 text-sm">Speark Match Demo</p>
      </div>

      <section className="w-full max-w-xl">
        <div className="mb-5">
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
              {project.tags.map((tag) => (
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
                onClick={() => nextProject("Passed")}
                className="py-4 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 transition"
              >
                Pass
              </button>

              <button
                onClick={interested}
                className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 transition font-medium col-span-2"
              >
                Interested
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-white/40">
          <p>Matches: {matches.length}</p>
          <p>{lastAction && `Last: ${lastAction}`}</p>
        </div>

        {matches.length > 0 && (
          <div className="mt-6 border border-white/10 rounded-3xl p-5 bg-white/[0.03]">
            <p className="text-sm text-white/40 mb-3">Your matches</p>
            <div className="space-y-2">
              {matches.map((match, i) => (
                <div
                  key={`${match}-${i}`}
                  className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm"
                >
                  {match}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}