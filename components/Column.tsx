"use client";

import { useStorage, useMutation } from "@/liveblocks.config";
import type { Note } from "@/liveblocks.config";
import NoteCard from "./NoteCard";
import AddNoteInput from "./AddNoteInput";
import { useDrag } from "./DragContext";
import { randomPastelColor } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface ColumnProps {
  columnId: Note["column"];
  label: string;
  emoji: string;
  headerColor: string;
}

export default function Column({ columnId, label, emoji, headerColor }: ColumnProps) {
  const { draggingId, overColumnId, setOverColumnId } = useDrag();

  const notes = useStorage((root) =>
    root.notes
      .filter((n) => n.column === columnId)
      .slice()
      .sort((a, b) => a.order - b.order)
  );

  const addNote = useMutation(({ storage }, text: string) => {
    const list = storage.get("notes");
    const colNotes = list.toArray().filter((n) => n.column === columnId);
    const maxOrder = colNotes.length > 0 ? Math.max(...colNotes.map((n) => n.order)) : 0;
    const newNote: Note = {
      id: uuidv4(),
      column: columnId,
      text,
      color: randomPastelColor(),
      reactions: {},
      createdAt: Date.now(),
      order: maxOrder + 1000,
    };
    list.push(newNote);
  }, [columnId]);

  const deleteNote = useMutation(({ storage }, noteId: string) => {
    const list = storage.get("notes");
    const index = list.findIndex((n) => n.id === noteId);
    if (index !== -1) list.delete(index);
  }, []);

  const editNote = useMutation(({ storage }, noteId: string, text: string) => {
    const list = storage.get("notes");
    const index = list.findIndex((n) => n.id === noteId);
    if (index !== -1) {
      const existing = list.get(index);
      if (existing) list.set(index, { ...existing, text });
    }
  }, []);

  const toggleReaction = useMutation(
    ({ storage }, noteId: string, reactionEmoji: string) => {
      const list = storage.get("notes");
      const index = list.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        const note = list.get(index);
        if (note) {
          const current = note.reactions[reactionEmoji] ?? 0;
          const reactions = { ...note.reactions, [reactionEmoji]: current + 1 };
          list.set(index, { ...note, reactions });
        }
      }
    },
    []
  );

  // Compute a new order value for inserting between two order values (or at ends)
  // and renumber the column if gaps get too small.
  const moveNote = useMutation(
    ({ storage }, draggedId: string, anchorId: string | null, position: "before" | "after" | "end") => {
      const list = storage.get("notes");
      const allNotes = list.toArray();
      const draggedIndex = allNotes.findIndex((n) => n.id === draggedId);
      if (draggedIndex === -1) return;
      const dragged = list.get(draggedIndex);
      if (!dragged) return;

      // Sorted notes in target column excluding the dragged note
      const colNotes = allNotes
        .filter((n) => n.column === columnId && n.id !== draggedId)
        .sort((a, b) => a.order - b.order);

      let newOrder: number;

      if (position === "end" || anchorId === null) {
        newOrder = colNotes.length > 0 ? colNotes[colNotes.length - 1].order + 1000 : 1000;
      } else {
        const anchorIndex = colNotes.findIndex((n) => n.id === anchorId);
        if (anchorIndex === -1) {
          newOrder = colNotes.length > 0 ? colNotes[colNotes.length - 1].order + 1000 : 1000;
        } else if (position === "before") {
          if (anchorIndex === 0) {
            newOrder = colNotes[0].order - 500;
          } else {
            newOrder = (colNotes[anchorIndex - 1].order + colNotes[anchorIndex].order) / 2;
          }
        } else {
          // after
          if (anchorIndex === colNotes.length - 1) {
            newOrder = colNotes[anchorIndex].order + 1000;
          } else {
            newOrder = (colNotes[anchorIndex].order + colNotes[anchorIndex + 1].order) / 2;
          }
        }
      }

      // If gap too small, renumber entire column
      const needsRenumber = colNotes.some((n, i) =>
        i > 0 && n.order - colNotes[i - 1].order < 1
      );
      if (needsRenumber) {
        // Build final sorted list with dragged inserted
        const insertAt =
          position === "end" || anchorId === null
            ? colNotes.length
            : position === "before"
            ? colNotes.findIndex((n) => n.id === anchorId)
            : colNotes.findIndex((n) => n.id === anchorId) + 1;
        const sorted = [...colNotes];
        sorted.splice(Math.max(0, insertAt), 0, { ...dragged, column: columnId });
        sorted.forEach((note, i) => {
          const idx = list.findIndex((n) => n.id === note.id);
          if (idx !== -1) { const existing = list.get(idx); if (existing) list.set(idx, { ...existing, column: columnId, order: (i + 1) * 1000 }); }
        });
        return;
      }

      list.set(draggedIndex, { ...dragged, column: columnId, order: newOrder });
    },
    [columnId]
  );

  // Drop on the column background → append at end
  function handleColumnDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData("noteId");
    if (id) moveNote(id, null, "end");
    setOverColumnId(null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverColumnId(columnId);
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOverColumnId(null);
    }
  }

  const isOver = overColumnId === columnId && draggingId !== null;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl transition-colors duration-150 ${
        isOver ? "bg-slate-200/70" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleColumnDrop}
    >
      {/* Column header */}
      <div className={`rounded-xl border-2 px-4 py-3 flex items-center gap-2 ${headerColor}`}>
        <span className="text-xl">{emoji}</span>
        <h2 className="font-bold text-slate-700 text-base">{label}</h2>
        <span className="ml-auto bg-white bg-opacity-60 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full">
          {notes.length}
        </span>
      </div>

      {/* Add note input */}
      <AddNoteInput onAdd={addNote} />

      {/* Notes */}
      <div className="flex flex-col gap-3 min-h-[4rem]">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => deleteNote(note.id)}
            onEdit={(text) => editNote(note.id, text)}
            onReact={(e) => toggleReaction(note.id, e)}
            onDropBefore={(draggedId) => moveNote(draggedId, note.id, "before")}
            onDropAfter={(draggedId) => moveNote(draggedId, note.id, "after")}
          />
        ))}
        {notes.length === 0 && !isOver && (
          <p className="text-center text-slate-400 text-sm py-8">
            No notes yet. Add one above!
          </p>
        )}
        {isOver && notes.length === 0 && (
          <div className="border-2 border-dashed border-slate-400 rounded-xl h-16 flex items-center justify-center text-slate-400 text-sm">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
