import { createClient } from "@/lib/supabase/server";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        User not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center gap-6">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              className="w-28 h-28 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              {profile.username?.[0]}
            </div>
          )}

          <div>
            <h1 className="text-5xl font-bold">
              {profile.username}
            </h1>

            <p className="text-white/50 mt-2">
              {profile.skill}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-white/80 text-lg leading-relaxed">
            {profile.bio}
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          {profile.website && (
            <a
              href={`https://${profile.website}`}
              target="_blank"
              className="border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition"
            >
              🌐 {profile.website}
            </a>
          )}

          {profile.twitter && (
            <a
              href={`https://x.com/${profile.twitter}`}
              target="_blank"
              className="border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition"
            >
              𝕏 @{profile.twitter}
            </a>
          )}

          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              className="border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition"
            >
              📸 @{profile.instagram}
            </a>
          )}

          {profile.github && (
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              className="border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition"
            >
              💻 {profile.github}
            </a>
          )}
        </div>
      </div>
    </main>
  );
}