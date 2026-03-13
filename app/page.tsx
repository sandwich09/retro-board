"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const id = roomId.trim().toLowerCase().replace(/\s+/g, "-") || "sprint-1";
    router.push(`/retro/${id}`);
  }

  function handleQuickStart() {
    const id = "sprint-" + Math.floor(Math.random() * 900 + 100);
    router.push(`/retro/${id}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-3">🗂️</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Retro Board</h1>
        <p className="text-slate-500 mb-8 text-sm">
          A real-time retrospective board for your team
        </p>

        <form onSubmit={handleJoin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Room name (e.g. sprint-42)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            Join Room
          </button>
        </form>

        <div className="mt-3">
          <button
            onClick={handleQuickStart}
            className="text-slate-500 hover:text-slate-700 text-sm underline underline-offset-2 transition-colors"
          >
            Quick start with a random room
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Share the URL with your team to collaborate in real time. No sign-up required.
        </p>
      </div>
    </main>
  );
}
