import JishoAPI from "unofficial-jisho-api";

const jisho = new JishoAPI();

const WANIKANI_TOKEN = "d14e7113-ab15-4ae5-83fd-31f17ccd2f4e";

export interface Entry {
  id: string;
  text: string;
  meanings: string[];
  readings: string[];
  wanikani?: boolean;
}

const searchWanikani = async (texts: string[]): Promise<Entry[]> => {
  try {
    const wanikani = await fetch(
      `https://api.wanikani.com/v2/subjects?slugs=${texts.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${WANIKANI_TOKEN}`,
        },
      }
    );
    let { data: response } = await wanikani.json();
    if (response.length > 1) {
      response = response.filter((d: any) => d.object === "vocabulary");
    }
    return response.map((d: any) => {
      return {
        id: d.id,
        text: d.data.slug,
        meanings: d.data.meanings?.map((m: any) => m.meaning.toLowerCase()),
        readings: d.data.readings?.map((r: any) => r.reading),
        wanikani: true,
      };
    });
  } catch {
    console.log(`Could not find wanikani results for ${texts.join(", ")}`);
    return [];
  }
};

export const search = async (text: string): Promise<Entry[]> => {
  let results = await searchWanikani([text]);
  if (results.length > 0) return results;

  const { data } = await jisho.searchForPhrase(text);
  const matches = data.filter(
    (entry) =>
      entry.slug === text ||
      (entry.is_common && entry.japanese.find((j) => j.reading === text))
  );

  const slugs = [
    ...new Set(
      matches.flatMap((m) => m.japanese.map((j) => j.word)).filter(Boolean)
    ),
  ];
  results = await searchWanikani(slugs);
  if (results.length > 0) return results;

  return matches.map((m) => {
    return {
      id: m.slug,
      text: m.slug,
      meanings: [
        ...new Set(m.senses.flatMap((s) => s.english_definitions)),
      ].slice(0, 5),
      readings: [...new Set(m.japanese.map((j) => j.reading))],
    };
  });
};
