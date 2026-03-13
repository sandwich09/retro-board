"use client";

import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";
import RetroBoard from "./RetroBoard";
import { randomUserColor, randomUserName } from "@/lib/utils";
import { useMemo } from "react";

interface RoomWrapperProps {
  roomId: string;
}

export default function RoomWrapper({ roomId }: RoomWrapperProps) {
  const userColor = useMemo(() => randomUserColor(), []);
  const userName = useMemo(() => randomUserName(), []);

  return (
    <RoomProvider
      id={`retro-${roomId}`}
      initialPresence={{ name: userName, color: userColor }}
      initialStorage={{ notes: new LiveList([]) }}
    >
      <ClientSideSuspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <p className="text-slate-500 text-lg">Connecting to board...</p>
          </div>
        }
      >
        <RetroBoard roomId={roomId} />
      </ClientSideSuspense>
    </RoomProvider>
  );
}
