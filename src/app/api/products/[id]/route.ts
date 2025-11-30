import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const payload = await req.json(); // whatever the client sends
    // TODO: handle payload (save to DB, call service, etc.)
    return NextResponse.json({ ok: true, id, received: payload });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
