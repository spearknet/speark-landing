"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function cleanUrl(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [imageIndex, setImageIndex] = useState(0);

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
    }

    loadProject();
  }, [id]);

  if (!project) {
    return <main className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</main>;
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

  function prevImage() {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextImage() {
    setImageIndex((prev) => (prev + 1) % images.length);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-5xl mx-auto border border-white/10 rounded-[2rem] overflow-hidden bg-white/[0.02]">
        <div className="relative h-[420px] bg-white/[0.03]">
          {images.length > 0 ? (
            <img src={images[imageIndex]} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">⚡</div>
          )}

          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 border border-white/10">
                ←
              </button>
              <button onClick={nextImage} className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 border border-white/10">
                →
              </button>
            </>
          )}
        </div>

        <div className="p-10">
          <p className="text-red-400 uppercase tracking-[0.2em] text-sm mb-4">{project.category}</p>
          <h1 className="text-6xl font-bold mb-6">{project.title}</h1>
          <p className="text-white/70 text-xl leading-relaxed mb-10">{project.description}</p>

          <p className="text-white/40 mb-2">Looking for</p>
          <p className="text-2xl mb-8">{project.looking_for}</p>

          <div className="flex flex-wrap gap-3 mb-10">
            {tags.map((tag: string) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white/10 text-white/70">
                {tag.trim()}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            {project.website && (
              <a href={cleanUrl(project.website)} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                Website
              </a>
            )}

            {project.instagram && (
              <a href={`https://instagram.com/${project.instagram.replace("@", "")}`} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                Instagram
              </a>
            )}

            {project.x && (
              <a href={`https://x.com/${project.x.replace("@", "")}`} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                X
              </a>
            )}

            {project.discord && (
              <a href={cleanUrl(project.discord)} target="_blank" className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500">
                Discord
              </a>
            )}
          </div>

          {author && (
            <a href={`/u/${author.username}`} className="flex items-center gap-5 border border-white/10 rounded-3xl p-5 hover:bg-white/5 transition">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10">
                {author.avatar_url && <img src={author.avatar_url} className="w-full h-full object-cover" />}
              </div>

              <div>
                <p className="text-white/40">Created by</p>
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