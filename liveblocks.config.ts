import { createClient } from "@liveblocks/client";
import type { LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

// Note type stored in Liveblocks storage
export type Note = {
  id: string;
  column: "went-well" | "to-improve" | "action-items";
  text: string;
  color: string;
  reactions: Record<string, number>;
  createdAt: number;
  order: number; // used for manual drag-and-drop ordering within a column
};

// Presence: what each connected user exposes to others
type Presence = {
  name: string;
  color: string;
};

// Storage: the shared persistent state for the room
type Storage = {
  notes: LiveList<Note>;
};

type UserMeta = {
  id?: string;
  info?: Record<string, never>;
};

type RoomEvent = never;

export const {
  suspense: {
    RoomProvider,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useStorage,
    useMutation,
    useStatus,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
