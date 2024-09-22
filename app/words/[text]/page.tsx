import { Entry, search } from "@/app/_lib/dictionary";
import { Suspense } from "react";
import { isKanji } from "wanakana";

export default async function WordPage({
  params,
}: {
  params: { text: string };
}) {
  const literal = decodeURIComponent(params.text);
  const word = await search(literal);
  return (
    <div>
      <pre>{JSON.stringify(word, null, 2)}</pre>
      <Suspense fallback={null}>
        <Components word={literal} />
      </Suspense>
    </div>
  );
}

async function getKanjisForWord(word: string): Promise<Entry[]> {
  const kanjiChars = new Set<string>([...word].filter(isKanji));

  const kanjis: Promise<Entry[]>[] = [];
  kanjiChars.forEach((char) => {
    kanjis.push(search(char));
  });

  const results = await Promise.all(kanjis);
  return results.flat();
}

async function Components({ word }: { word: string }) {
  const results = await getKanjisForWord(word);
  return <pre>{JSON.stringify(results, null, 2)}</pre>;
}
