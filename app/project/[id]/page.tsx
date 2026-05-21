"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [sparks, setSparks] = useState(0);

  useEffect(() => {
    async function loadProject() {
      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      setProject(projectData);

      if (projectData?.owner_id) {
        const { data: authorData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", projectData.owner_id)
          .single();

        setAuthor(authorData);
      }

      const { data: sparksData } = await supabase
        .from("project_sparks")
        .select("id")
        .eq("project_id", id);

      setSparks(sparksData?.length || 0);
    }

    loadProject();
  }, [id]);

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  const tags = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === "string"
    ? project.tags.split(",")
    : [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-5xl mx-auto border border-white/10 rounded-[2rem] overflow-hidden bg-white/[0.02]">
        <div className="h-[420px] bg-white/[0.03]">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              ⚡
            </div>
          )}
        </div>

        <div className="p-10">
          <p className="text-red-400 uppercase tracking-[0.2em] text-sm mb-4">
            {project.category}
          </p>

          <h1 className="text-6xl font-bold mb-6">{project.title}</h1>

          <p className="text-white/70 text-xl leading-relaxed mb-10">
            {project.description}
          </p>

          <div className="mb-10">
            <p className="text-white/40 mb-2">Looking for</p>
            <p className="text-2xl">{project.looking_for}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-white/10 text-white/70"
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          <p className="text-red-400 font-medium mb-12">
            ⚡ {sparks} Sparks
          </p>

          {author && (
            <a
              href={`/u/${author.username}`}
              className="flex items-center gap-5 border border-white/10 rounded-3xl p-5 hover:bg-white/5 transition"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border border-white/10">
                {author.avatar_url && (
                  <img
                    src={author.avatar_url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div>
                <p className="text-white/40 mb-1">Created by</p>
                <h2 className="text-2xl font-bold">{author.username}</h2>
                <p className="text-red-400">{author.skill}</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}