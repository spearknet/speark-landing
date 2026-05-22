export default function ClosedPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-6">
          Speark is Closed
        </h1>

        <p className="text-white/60 text-xl mb-10">
          Thank you to everyone who was part of the journey.
        </p>

        <a
          href="https://www.youtube.com/watch?v=fj2ddkPgiMU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 transition text-xl font-semibold"
        >
          STOP STALKING
        </a>
      </div>
    </main>
  );
}