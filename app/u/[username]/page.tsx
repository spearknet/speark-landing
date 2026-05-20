"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", params.username)
        .single();

      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", profileData.id);

      setProjects(projectsData || []);
      setLoading(false);
    }

    loadUser();
  }, [params.username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        User not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="border border-white/10 rounded-[2rem] p-10 bg-white/[0.02]">
          <div className="flex items-center gap-8 mb-10">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-white/10 bg-white/10">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {profile.username?.[0]}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-5xl font-bold">{profile.username}</h1>
              <p className="text-red-400 mt-3 text-lg">{profile.skill}</p>
            </div>
          </div>

          <p className="text-white/70 text-lg leading-relaxed mb-10">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            {profile.website && (
              <a href={`https://${profile.website}`} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                Website
              </a>
            )}

            {profile.instagram && (
              <a href={`https://instagram.com/${profile.instagram}`} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                Instagram
              </a>
            )}

            {profile.x && (
              <a href={`https://x.com/${profile.x}`} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                X
              </a>
            )}

            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5">
                GitHub
              </a>
            )}
          </div>

          <h2 className="text-3xl font-bold mb-8">Projects</h2>

          <div className="grid gap-5">
            {projects.map((project) => (
              <div key={project.id} className="border border-white/10 rounded-[2rem] p-6 bg-white/[0.03]">
                <p className="text-red-400 text-sm mb-3">{project.category}</p>
                <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                <p className="text-white/60 mb-5">{project.description}</p>
                <p className="text-white/40">
                  Looking for:{" "}
                  <span className="text-white/70">{project.looking_for}</span>
                </p>
              </div>
            ))}

            {projects.length === 0 && (
              <p className="text-white/40">No projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}