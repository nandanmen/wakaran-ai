import { parseText } from "@/app/_lib/jpdb/parse";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }
  return NextResponse.json(await parseText(text), { status: 200 });
}
