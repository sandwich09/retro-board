import RoomWrapper from "@/components/RoomWrapper";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function RetroPage({ params }: PageProps) {
  const { roomId } = await params;
  return <RoomWrapper roomId={roomId} />;
}
