export default function SpearkLanding() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.25),transparent_35%)]" />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Speark Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-semibold tracking-wide">Speark</span>
        </div>

        <div className="flex items-center gap-5 text-sm text-white/70">
          <a href="#vision" className="hover:text-white transition">Vision</a>
          <a href="#community" className="hover:text-white transition">Community</a>
          <a href="#join" className="hover:text-white transition">Join</a>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-32 pb-24">
        <div className="mb-8 flex items-center justify-center">
          <img src="/logo.png" alt="Speark Logo" className="w-28 h-28 object-contain" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-5xl leading-tight">
          Build projects <br /> together.
        </h1>

        <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
          Speark is a social network for creators, developers, artists,
          entrepreneurs, and builders.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href="https://discord.gg/wcp88puzs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-black rounded-2xl font-medium hover:scale-105 transition"
          >
            Join Community
          </a>

          <a
            href="#vision"
            className="px-8 py-4 border border-white/20 rounded-2xl text-white/80 hover:bg-white/5 transition"
          >
            Learn More
          </a>
        </div>
		<div className="mt-12 flex flex-col sm:flex-row gap-4">

  <a
    href="https://discord.gg/wcp88puzs"
    target="_blank"
    rel="noopener noreferrer"
    className="px-8 py-4 bg-white text-black rounded-2xl font-medium hover:scale-105 transition"
  >
    Join Community
  </a>

  <a
    href="#vision"
    className="px-8 py-4 border border-white/20 rounded-2xl text-white/80 hover:bg-white/5 transition"
  >
    Learn More
  </a>

  <a
    href="/swipe"
    className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-medium transition"
  >
    Try Speark Match
  </a>

</div>
      </main>

      <section
        id="vision"
        className="relative z-10 grid md:grid-cols-3 gap-6 px-6 md:px-12 pb-24"
      >
        {[
          {
            title: "Connect",
            text: "Meet creators, developers, artists, and ambitious people from around the world.",
          },
          {
            title: "Collaborate",
            text: "Find teammates, share ideas, and build real projects together.",
          },
          {
            title: "Grow",
            text: "Show your skills, gain experience, and become part of the next generation of builders.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
            <p className="text-white/60 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      <section id="community" className="relative z-10 px-6 md:px-12 pb-24">
        <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40 mb-4">
            Community Driven
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto">
            A place where ideas become real projects.
          </h2>

          <p className="mt-6 text-white/60 max-w-2xl mx-auto leading-relaxed">
            Speark is focused on collaboration, creativity, and meaningful
            connections between people who want to build something together.
          </p>
        </div>
      </section>

      <section id="join" className="relative z-10 px-6 md:px-12 pb-32">
        <div className="border border-white/10 rounded-[2rem] p-10 text-center bg-gradient-to-b from-white/[0.04] to-transparent">
          <h2 className="text-4xl md:text-5xl font-bold">
            Starting from zero.
          </h2>

          <p className="mt-5 text-white/60 text-lg">
            Join the early Speark community.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a
              href="https://discord.gg/wcp88puzs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 bg-red-600 rounded-2xl hover:bg-red-500 transition font-medium text-center"
            >
              Discord
            </a>

            <a
              href="https://x.com/spearknet"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 border border-white/10 rounded-2xl text-white/70 hover:bg-white/5 transition text-center"
            >
              X
            </a>

            <a
              href="https://instagram.com/mikhail.kalin.speark"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 border border-white/10 rounded-2xl text-white/70 hover:bg-white/5 transition text-center"
            >
              Instagram
            </a>

            <a
              href="https://tiktok.com/@spearknet"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 border border-white/10 rounded-2xl text-white/70 hover:bg-white/5 transition text-center"
            >
              TikTok
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}