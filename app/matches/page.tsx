"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMatches() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setMessage("Please log in first.");
        return;
      }

      const { data, error } = await supabase
        .from("matches")
        .select(`
  *,
  projects (
    title,
    description
  )
`)
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) setMessage(error.message);
      else setMatches(data || []);
    }

    loadMatches();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <a href="/swipe" className="text-white/40 text-sm">
          ← Back to Speark Match
        </a>

        <h1 className="text-4xl font-bold mt-8 mb-3">Your matches</h1>
        <p className="text-white/50 mb-8">
          Projects you requested to join.
        </p>

        {message && <p className="text-white/50">{message}</p>}

        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="border border-white/10 rounded-3xl p-5 bg-white/[0.03]"
            >
              <p className="text-white/40 text-sm">Project</p>
              <p className="text-xl font-semibold">
  {match.projects?.title}
</p>

<p className="text-white/50 mt-2">
  {match.projects?.description}
</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}