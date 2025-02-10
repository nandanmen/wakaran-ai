import { isKanji } from "wanakana";

export function checkCorrect(
  word: {
    text: string;
    readings: string[];
    meanings: string[];
  },
  response: {
    meaning: string;
    reading: string;
  },
): {
  reading: boolean;
  meaning: boolean;
} {
  const hasKanji = [...word.text].some(isKanji);
  const isMeaningCorrect = word.meanings.some((meaning) => {
    const regexForParenthesis = /\(([^)]+)\)/g;
    const withoutParens = meaning
      .replace(regexForParenthesis, "")
      .toLowerCase()
      .trim();
    const withoutParensIncluded = meaning
      .replaceAll("(", "")
      .replaceAll(")", "")
      .toLowerCase()
      .trim();
    const responseText = response.meaning.toLowerCase().trim();
    return [withoutParens, withoutParensIncluded].includes(responseText);
  });
  const isReadingCorrect = hasKanji
    ? word.readings.includes(response.reading)
    : true;
  return {
    reading: isReadingCorrect,
    meaning: isMeaningCorrect,
  };
}
