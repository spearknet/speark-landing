"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUser(data.user);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        setProfile(profileData);
      }
    }

    loadUser();
  }, []);

  async function searchUsers(value: string) {
    setSearch(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${value}%`)
      .limit(5);

    setResults(data || []);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <a href="/" className="text-xl font-bold tracking-wide">
          Speark
        </a>

        <div className="relative flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => searchUsers(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm"
          />

          {results.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {results.map((user) => (
                <a
                  key={user.id}
                  href={`/u/${user.username}`}
                  className="block px-4 py-3 hover:bg-white/[0.06]"
                >
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-white/40">{user.skill}</p>
                </a>
              ))}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-5 text-sm">
          <a href="/swipe" className="text-white/60 hover:text-white">
            Swipe
          </a>

          <a href="/create-project" className="text-red-500 hover:text-red-400">
            + Project
          </a>

          {user ? (
            <a href="/profile" className="flex items-center gap-3">
              <span className="hidden sm:block text-white/60">My Profile</span>

              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">
                    {profile?.username?.[0] || "S"}
                  </div>
                )}
              </div>
            </a>
          ) : (
            <a
              href="/login"
              className="px-5 py-3 rounded-2xl bg-white text-black font-medium"
            >
              Login
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}