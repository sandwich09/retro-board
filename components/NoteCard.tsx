"use client";

import { useState, useRef } from "react";
import type { Note } from "@/liveblocks.config";
import { useDrag } from "./DragContext";

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "🎉"];

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
  onEdit: (text: string) => void;
  onReact: (emoji: string) => void;
  onDropBefore: (draggedNoteId: string) => void;
  onDropAfter: (draggedNoteId: string) => void;
}

export default function NoteCard({ note, onDelete, onEdit, onReact, onDropBefore, onDropAfter }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [showReactions, setShowReactions] = useState(false);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { draggingId, setDraggingId, setOverNoteId, setOverColumnId } = useDrag();

  const isDragging = draggingId === note.id;

  // ── Edit handlers ────────────────────────────────────────────────────
  function handleSaveEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== note.text) onEdit(trimmed);
    else setEditText(note.text);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
    if (e.key === "Escape") { setEditText(note.text); setIsEditing(false); }
  }

  // ── Drag source handlers ─────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("noteId", note.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(note.id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setOverNoteId(null);
    setDropPosition(null);
  }

  // ── Drop target handlers ─────────────────────────────────────────────
  function getHalf(e: React.DragEvent): "top" | "bottom" {
    const rect = cardRef.current!.getBoundingClientRect();
    return e.clientY < rect.top + rect.height / 2 ? "top" : "bottom";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    const half = getHalf(e);
    setDropPosition(half);
    setOverNoteId(note.id);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!cardRef.current?.contains(e.relatedTarget as Node)) {
      setDropPosition(null);
      setOverNoteId(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("noteId");
    if (!draggedId || draggedId === note.id) {
      setDropPosition(null);
      return;
    }
    const half = getHalf(e);
    if (half === "top") {
      onDropBefore(draggedId);
    } else {
      onDropAfter(draggedId);
    }
    setDropPosition(null);
    setOverNoteId(null);
  }

  const totalReactions = Object.values(note.reactions).reduce((a, b) => a + b, 0);

  return (
    <div className="relative">
      {/* Top drop indicator */}
      {dropPosition === "top" && draggingId && draggingId !== note.id && (
        <div className="h-1 rounded-full bg-blue-400 mb-1 mx-1 transition-all" />
      )}

      <div
        ref={cardRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl shadow-sm p-4 flex flex-col gap-2 group relative border border-black/5 transition-opacity duration-150 ${
          isDragging ? "opacity-40 scale-95" : "opacity-100"
        }`}
        style={{ backgroundColor: note.color }}
      >
        {/* Drag handle + actions row */}
        <div className="flex items-start gap-2">
          {/* Drag handle — always visible, clearly grabbable */}
          <div
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 pt-0.5 shrink-0 select-none transition-colors"
            title="Drag to reorder or move"
          >
            ⠿
          </div>

          {isEditing ? (
            <textarea
              className="flex-1 bg-transparent resize-none text-slate-700 text-sm focus:outline-none leading-relaxed"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              autoFocus
              rows={3}
            />
          ) : (
            <p
              className="flex-1 text-slate-700 text-sm leading-relaxed cursor-pointer"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {note.text}
            </p>
          )}

          {/* Action buttons — visible on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setShowReactions((v) => !v)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-black/10 transition-colors text-xs"
              title="React"
            >
              😊
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-black/10 transition-colors text-xs"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-black/10 transition-colors text-xs"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div className="flex gap-1 flex-wrap pl-5">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { onReact(emoji); setShowReactions(false); }}
                className="text-lg hover:scale-125 transition-transform"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Existing reactions */}
        {totalReactions > 0 && (
          <div className="flex gap-1 flex-wrap mt-1 pl-5">
            {Object.entries(note.reactions)
              .filter(([, count]) => count > 0)
              .map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(emoji)}
                  className="flex items-center gap-0.5 text-xs bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full px-2 py-0.5 transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="text-slate-600 font-medium">{count}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Bottom drop indicator */}
      {dropPosition === "bottom" && draggingId && draggingId !== note.id && (
        <div className="h-1 rounded-full bg-blue-400 mt-1 mx-1 transition-all" />
      )}
    </div>
  );
}
