import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Instantiate inside the handler so it runs at request time, not build time
  const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });

  // No authentication — anyone can join any room
  const { room } = await request.json();

  const session = liveblocks.prepareSession("user-" + Math.random().toString(36).slice(2), {
    userInfo: {},
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
