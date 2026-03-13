"use client";

import { createContext, useContext, useState } from "react";
import type { Note } from "@/liveblocks.config";

interface DragState {
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  overNoteId: string | null;
  setOverNoteId: (id: string | null) => void;
  overColumnId: Note["column"] | null;
  setOverColumnId: (id: Note["column"] | null) => void;
}

const DragContext = createContext<DragState | null>(null);

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overNoteId, setOverNoteId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<Note["column"] | null>(null);

  return (
    <DragContext.Provider
      value={{ draggingId, setDraggingId, overNoteId, setOverNoteId, overColumnId, setOverColumnId }}
    >
      {children}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error("useDrag must be used inside DragProvider");
  return ctx;
}
