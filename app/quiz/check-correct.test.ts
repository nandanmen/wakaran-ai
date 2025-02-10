import { describe, expect, test } from "vitest";
import { checkCorrect } from "./check-correct";

describe("checkCorrect function", () => {
  test("correct meaning and reading", () => {
    expect(
      checkCorrect(
        {
          text: "犬",
          readings: ["いぬ"],
          meanings: ["dog"],
        },
        {
          meaning: "dog",
          reading: "いぬ",
        },
      ),
    ).toEqual({ reading: true, meaning: true });
  });

  test("incorrect meaning, correct reading", () => {
    expect(
      checkCorrect(
        {
          text: "猫",
          readings: ["ねこ"],
          meanings: ["cat"],
        },
        {
          meaning: "dog",
          reading: "ねこ",
        },
      ),
    ).toEqual({ reading: true, meaning: false });
  });

  test("correct meaning, incorrect reading", () => {
    expect(
      checkCorrect(
        {
          text: "鳥",
          readings: ["とり"],
          meanings: ["bird"],
        },
        {
          meaning: "bird",
          reading: "ちょう",
        },
      ),
    ).toEqual({ reading: false, meaning: true });
  });

  test("multiple meanings, one is correct", () => {
    expect(
      checkCorrect(
        {
          text: "走る",
          readings: ["はしる"],
          meanings: ["to run", "to dash"],
        },
        {
          meaning: "to dash",
          reading: "はしる",
        },
      ),
    ).toEqual({ reading: true, meaning: true });
  });

  test("hiragana word (no kanji)", () => {
    expect(
      checkCorrect(
        {
          text: "ありがとう",
          readings: ["ありがとう"],
          meanings: ["thank you", "thanks"],
        },
        {
          meaning: "thank you",
          reading: "ありがとう",
        },
      ),
    ).toEqual({ reading: true, meaning: true });
  });

  test("meaning with parentheses", () => {
    expect(
      checkCorrect(
        {
          text: "私",
          readings: ["わたし"],
          meanings: ["I", "me", "myself (pronoun)"],
        },
        {
          meaning: "myself",
          reading: "わたし",
        },
      ),
    ).toEqual({ reading: true, meaning: true });
  });

  test("meaning with parenthesis included", () => {
    expect(
      checkCorrect(
        {
          text: "私",
          readings: ["わたし"],
          meanings: ["I", "me", "myself (pronoun)"],
        },
        {
          meaning: "myself pronoun",
          reading: "わたし",
        },
      ),
    ).toEqual({ reading: true, meaning: true });
  });

  test("case insensitive meaning check", () => {
    expect(
      checkCorrect(
        {
          text: "本",
          readings: ["ほん"],
          meanings: ["book", "main", "true", "real"],
        },
        {
          meaning: "BOOK",
          reading: "ほん",
        },
      ),
    ).toEqual({ reading: true, meaning: true });
  });
});
