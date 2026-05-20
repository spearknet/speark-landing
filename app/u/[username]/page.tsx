"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", username)
        .limit(1);

      const foundProfile = profiles?.[0];

      if (!foundProfile) {
        setLoading(false);
        return;
      }

      setProfile(foundProfile);

      const { data: userProjects } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", foundProfile.id);

      setProjects(userProjects || []);
      setLoading(false);
    }

    loadUser();
  }, [username]);

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
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-5xl mx-auto border border-white/10 rounded-[2rem] p-10 bg-white/[0.02]">
        <div className="flex items-center gap-8 mb-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-white/10 bg-white/10">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
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

        <p className="text-white/70 text-lg mb-12">{profile.bio}</p>

        <h2 className="text-3xl font-bold mb-6">Projects</h2>

        <div className="grid gap-5">
          {projects.map((project) => (
            <div key={project.id} className="border border-white/10 rounded-[2rem] p-6">
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-white/60">{project.description}</p>
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