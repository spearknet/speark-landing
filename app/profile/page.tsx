"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  async function loadProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    setUserId(userData.user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    setProfile(profileData);

    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userData.user.id)
      .order("created_at", { ascending: false });

    setProjects(projectData || []);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function deleteProject(projectId: number) {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("owner_id", userId);

    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-5xl mx-auto border border-white/10 rounded-[2rem] p-10 bg-white/[0.02]">
        <div className="flex justify-end gap-3 mb-8">
          <button
            onClick={logout}
            className="px-5 py-3 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 transition"
          >
            Log out
          </button>

          <a
            href="/profile/edit"
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 transition"
          >
            Edit profile
          </a>
        </div>

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

        <p className="text-white/70 text-lg mb-8">{profile.bio}</p>

        <div className="flex flex-wrap gap-3 mb-14">
          {profile.website && (
            <a
              href={`https://${profile.website.replace(/^https?:\/\//, "")}`}
              target="_blank"
              className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5"
            >
              Website
            </a>
          )}

          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
              target="_blank"
              className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5"
            >
              Instagram
            </a>
          )}

          {profile.x && (
            <a
              href={`https://x.com/${profile.x.replace("@", "")}`}
              target="_blank"
              className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5"
            >
              X
            </a>
          )}

          {profile.github && (
            <a
              href={`https://github.com/${profile.github.replace("@", "")}`}
              target="_blank"
              className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5"
            >
              GitHub
            </a>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-6">Projects</h2>

        <div className="grid gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-white/10 rounded-[2rem] p-6 flex items-center justify-between gap-6"
            >
              <a href={`/project/${project.id}`} className="block flex-1">
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-white/60">{project.description}</p>
              </a>

              <button
                onClick={() => deleteProject(project.id)}
                className="px-5 py-3 rounded-2xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
              >
                Delete
              </button>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="text-white/40">No projects yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}