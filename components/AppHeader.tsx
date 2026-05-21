"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AppHeader() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", data.user.id)
        .single();

      if (profile?.avatar_url) {
        setAvatar(profile.avatar_url);
      }
    }

    loadUser();
  }, []);

  async function searchUsers(value: string) {
    setQuery(value);

    if (!value) {
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
    <header className="w-full border-b border-white/10 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-24 px-6 flex items-center justify-between gap-8">

        {/* LEFT */}
        <Link
          href="/"
          className="flex items-center gap-4 hover:opacity-80 transition"
        >
          <img
            src="/logo.png"
            alt="Speark"
            className="w-12 h-12 object-contain"
          />

          <span className="text-4xl font-bold tracking-tight text-white">
            Speark
          </span>
        </Link>

        {/* CENTER */}
        <div className="relative flex-1 max-w-2xl">
          <input
            value={query}
            onChange={(e) => searchUsers(e.target.value)}
            placeholder="Search users..."
            className="w-full h-16 bg-transparent border border-white/10 rounded-3xl px-6 text-white outline-none text-lg"
          />

          {results.length > 0 && (
            <div className="absolute top-20 left-0 w-full bg-black border border-white/10 rounded-3xl overflow-hidden z-50">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/u/${user.username}`}
                  className="block px-6 py-5 hover:bg-white/5 transition border-b border-white/5 last:border-none"
                >
                  <div className="text-white text-2xl font-semibold">
                    {user.username}
                  </div>

                  <div className="text-white/40 text-lg mt-1">
                    {user.skill}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <Link
          href="/profile"
          className="flex items-center gap-4 hover:opacity-80 transition"
        >
          <span className="text-2xl text-white">My Profile</span>

          <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/10">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl">
                M
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}