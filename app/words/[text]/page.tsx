import { Entry, search } from "@/app/_lib/dictionary";
import { Suspense } from "react";
import JishoAPI from "unofficial-jisho-api";
import { isKanji } from "wanakana";

const jisho = new JishoAPI();

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

async function getKanjisForWord(word: string): Promise<unknown[]> {
  const kanjiChars = new Set<string>([...word].filter(isKanji));

  const kanjis: Promise<unknown[]>[] = [];
  kanjiChars.forEach((char) => {
    kanjis.push(jisho.searchForKanji(char));
  });

  const results = await Promise.all(kanjis);
  //   return results.flat();
  return results;
}

async function Components({ word }: { word: string }) {
  const results = await getKanjisForWord(word);
  return <pre>{JSON.stringify(results, null, 2)}</pre>;
}
