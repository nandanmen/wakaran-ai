import { search } from "@/app/_lib/dictionary";
import { NextResponse } from "next/server";
import { isKanji } from "wanakana";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get("word");
  if (!word) {
    return NextResponse.json({ error: "No word provided" }, { status: 400 });
  }
  const kanjis = [...word].filter(isKanji);
  if (!kanjis.length) {
    return NextResponse.json({ kanjis: [] }, { status: 200 });
  }
  const results = await Promise.all(kanjis.map(search));
  return NextResponse.json(
    {
      kanjis: results.flat(),
    },
    { status: 200 }
  );
}
