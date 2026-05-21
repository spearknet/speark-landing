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

      if (profile?.avatar_url) setAvatar(profile.avatar_url);
    }

    loadUser();
  }, []);

  async function searchUsers(value: string) {
    setQuery(value);

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
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 md:h-24 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Speark" className="w-9 h-9 sm:w-11 sm:h-11 object-contain" />
            <span className="text-3xl sm:text-4xl font-bold text-white">
              Speark
            </span>
          </Link>

          <Link href="/profile" className="md:hidden flex items-center gap-3">
            <span className="text-white text-base">My Profile</span>
            <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 bg-white/10">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">M</div>
              )}
            </div>
          </Link>
        </div>

        <div className="relative w-full md:max-w-xl">
          <input
            value={query}
            onChange={(e) => searchUsers(e.target.value)}
            placeholder="Search users..."
            className="w-full h-13 sm:h-14 bg-white/[0.04] border border-white/10 rounded-2xl px-5 text-white outline-none text-base"
          />

          {results.length > 0 && (
            <div className="absolute top-16 left-0 right-0 bg-black border border-white/10 rounded-2xl overflow-hidden z-50">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/u/${user.username}`}
                  className="block px-5 py-4 hover:bg-white/5"
                >
                  <div className="text-white font-semibold">{user.username}</div>
                  <div className="text-white/40 text-sm">{user.skill}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/profile" className="hidden md:flex items-center gap-4">
          <span className="text-2xl text-white">My Profile</span>
          <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/10">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl">M</div>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}