"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function SwipePage() {
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    const { data } = await supabase
      .from("projects")
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (data) {
      setProjects(data);
    }
  }

  async function sparkProject(projectId: string) {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const project = projects[index];

    const newCount = (project.sparks || 0) + 1;

    await supabase
      .from("projects")
      .update({
        sparks: newCount,
      })
      .eq("id", projectId);

    const updated = [...projects];

    updated[index].sparks = newCount;

    setProjects(updated);

    nextProject();
  }

  function nextProject() {
    if (index < projects.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!projects.length) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  const project = projects[index];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Speark"
              width={26}
              height={26}
              className="object-contain"
            />

            <h1 className="text-3xl font-bold">
              Speark
            </h1>
          </Link>

          <input
            placeholder="Search users..."
            className="flex-1 max-w-2xl bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-3 shrink-0"
            >
              <span className="text-2xl font-semibold hidden md:block">
                My Profile
              </span>

              <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-zinc-900">
                <Image
                  src="/avatar.png"
                  alt="avatar"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white hover:text-black transition"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <section className="flex justify-center px-4 py-10">
        <div className="w-full max-w-2xl border border-white/10 rounded-[32px] overflow-hidden bg-black">
          {/* IMAGE */}
          <div className="relative aspect-[4/3] bg-zinc-950">
            <Image
              src={project.image_url || "/placeholder.png"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {/* INFO */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <p className="uppercase tracking-[0.3em] text-red-400 text-sm">
                {project.category || "PROJECT"}
              </p>

              <div className="text-zinc-400 text-sm">
                ⚡ {project.sparks || 0} Sparks
              </div>
            </div>

            <h2 className="text-6xl font-bold mb-5">
              {project.title}
            </h2>

            <p className="text-zinc-300 text-xl mb-8">
              {project.description}
            </p>

            <div className="mb-8">
              <p className="text-zinc-500 mb-2">
                Looking for
              </p>

              <p className="text-3xl font-medium">
                {project.looking_for}
              </p>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tags?.map((tag: string, i: number) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-full bg-zinc-900 text-sm"
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* AUTHOR */}
            <Link
              href={`/u/${project.profiles?.username}`}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10">
                <Image
                  src={
                    project.profiles?.avatar_url ||
                    "/avatar.png"
                  }
                  alt="author"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  Created by
                </p>

                <p className="text-xl font-semibold">
                  {project.profiles?.username}
                </p>
              </div>
            </Link>

            {/* BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={nextProject}
                className="h-16 rounded-2xl border border-white/10 hover:bg-white hover:text-black transition text-xl"
              >
                Pass
              </button>

              <button
                onClick={() => sparkProject(project.id)}
                className="h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 transition text-xl font-semibold"
              >
                ⚡ Spark
              </button>

              <Link
                href={`/project/${project.id}`}
                className="h-16 rounded-2xl bg-red-500 hover:bg-red-600 transition text-xl font-semibold flex items-center justify-center"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}