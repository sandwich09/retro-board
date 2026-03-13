"use client";

import { useOthers, useSelf } from "@/liveblocks.config";
import Column from "./Column";
import { DragProvider } from "./DragContext";
import type { Note } from "@/liveblocks.config";

const COLUMNS: { id: Note["column"]; label: string; emoji: string; headerColor: string }[] = [
  { id: "went-well", label: "Went Well", emoji: "👍", headerColor: "bg-green-100 border-green-300" },
  { id: "to-improve", label: "To Improve", emoji: "😕", headerColor: "bg-amber-100 border-amber-300" },
  { id: "action-items", label: "Action Items", emoji: "💡", headerColor: "bg-blue-100 border-blue-300" },
];

interface RetroBoardProps {
  roomId: string;
}

export default function RetroBoard({ roomId }: RetroBoardProps) {
  const others = useOthers();
  const self = useSelf();
  const connectedCount = others.length + 1; // include self

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗂️</span>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Retro Board</h1>
            <p className="text-xs text-slate-400">
              Room: <span className="font-mono text-slate-600">{roomId}</span>
            </p>
          </div>
        </div>

        {/* Connected users */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {/* Self */}
            {self && (
              <div
                key="self"
                title={`${self.presence.name} (you)`}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow"
                style={{ backgroundColor: self.presence.color }}
              >
                {self.presence.name.charAt(0)}
              </div>
            )}
            {/* Others */}
            {others.slice(0, 5).map((user) => (
              <div
                key={user.connectionId}
                title={user.presence.name}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow"
                style={{ backgroundColor: user.presence.color }}
              >
                {user.presence.name.charAt(0)}
              </div>
            ))}
            {others.length > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-white text-xs font-bold shadow">
                +{others.length - 5}
              </div>
            )}
          </div>
          <span className="text-sm text-slate-500">
            {connectedCount} {connectedCount === 1 ? "person" : "people"} online
          </span>
        </div>
      </header>

      {/* Share link hint */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-2 text-xs text-blue-600 flex items-center gap-2">
        <span>Share this URL with your team:</span>
        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-700 select-all">
          {typeof window !== "undefined" ? window.location.href : ""}
        </span>
      </div>

      {/* Board columns */}
      <DragProvider>
        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              label={col.label}
              emoji={col.emoji}
              headerColor={col.headerColor}
            />
          ))}
        </main>
      </DragProvider>
    </div>
  );
}
