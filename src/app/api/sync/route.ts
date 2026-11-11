import { NextRequest, NextResponse } from 'next/server';

// In-memory sync room storage for server runtime
// Global map survives across hot reloads and lambda warm invocations
const globalSyncRooms = global as unknown as {
  __cat_sync_rooms?: Map<string, { data: unknown; updatedAt: number }>;
};

if (!globalSyncRooms.__cat_sync_rooms) {
  globalSyncRooms.__cat_sync_rooms = new Map();
}

const syncStore = globalSyncRooms.__cat_sync_rooms;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room');

  if (!room) {
    return NextResponse.json({ error: 'Missing room parameter' }, { status: 400 });
  }

  const roomData = syncStore.get(room);
  if (!roomData) {
    return NextResponse.json({ room, data: null, updatedAt: null });
  }

  return NextResponse.json({ room, data: roomData.data, updatedAt: roomData.updatedAt });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room, data } = body;

    if (!room || !data) {
      return NextResponse.json({ error: 'Room and data are required' }, { status: 400 });
    }

    const sanitizedRoom = String(room).trim().toLowerCase();
    const updatedAt = Date.now();
    syncStore.set(sanitizedRoom, { data, updatedAt });

    return NextResponse.json({ success: true, room: sanitizedRoom, updatedAt });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
