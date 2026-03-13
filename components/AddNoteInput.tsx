"use client";

import { useState } from "react";

interface AddNoteInputProps {
  onAdd: (text: string) => void;
}

export default function AddNoteInput({ onAdd }: AddNoteInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a note... (Enter to submit)"
        rows={2}
        className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="self-end text-sm bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg px-3 py-1.5 transition-colors font-medium"
      >
        + Add Note
      </button>
    </form>
  );
}
