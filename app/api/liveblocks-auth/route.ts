import { liveblocks } from "@/lib/liveblocks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // No authentication — anyone can join any room
  const { room } = await request.json();

  const session = liveblocks.prepareSession("user-" + Math.random().toString(36).slice(2), {
    userInfo: {},
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
