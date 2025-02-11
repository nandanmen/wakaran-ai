import { expect, test, describe } from "vitest";
import type { JpdbResponse } from "./types";
import { parseResponse } from "./parse";

const exampleResponse = {
  tokens: [
    [
      0,
      0,
      2,
      [
        ["親", "おや"],
        ["方", "かた"],
      ],
    ],
    [1, 2, 1, null],
    [2, 3, 4, [["探", "さが"], "してる"]],
    [3, 7, 1, null],
  ],
  vocabulary: [
    [
      1365360,
      2487824958,
      "親方",
      "おやかた",
      12100,
      [
        "master; boss; chief; foreman; supervisor",
        "stable master",
        "craftsman; artisan",
        "foster parent",
      ],
      ["n"],
    ],
    [
      2029010,
      2204186150,
      "を",
      "を",
      100,
      [
        "indicates direct object of action",
        "indicates subject of causative expression",
        "indicates an area traversed",
        "indicates time (period) over which action takes place",
        "indicates point of departure or separation of action",
        "indicates object of desire, like, hate, etc.",
      ],
      ["prt"],
    ],
    [
      1593670,
      1867082528,
      "探す",
      "さがす",
      600,
      [
        "to search for; to look for; to hunt for; to seek",
        "to search (a house, pocket, etc.); to search through; to rummage in (e.g. a drawer); to fish around",
      ],
      ["vt", "v5", "v5s"],
    ],
    [
      1469800,
      2204745125,
      "の",
      "の",
      100,
      [
        "indicates possessive",
        "nominalizes verbs and adjectives",
        'substitutes for "ga" in subordinate phrases',
        "(at sentence-end, falling tone) indicates a confident conclusion",
        "(at sentence-end) indicates emotional emphasis",
        "(at sentence-end, rising tone) indicates question",
      ],
      ["prt"],
    ],
  ],
} as JpdbResponse;

describe("parse jpdb response", () => {
  test("should parse the response", () => {
    const result = parseResponse("親方を探してるの", exampleResponse);
    expect(result).toEqual({
      text: "親方を探してるの",
      vocabulary: {
        "1365360:2487824958": {
          jpdbId: [1365360, 2487824958],
          dictionary: "親方",
          meanings: [
            "master; boss; chief; foreman; supervisor",
            "stable master",
            "craftsman; artisan",
            "foster parent",
          ],
          reading: [
            {
              text: "親",
              reading: "おや",
            },
            {
              text: "方",
              reading: "かた",
            },
          ],
          ranking: 12100,
          partsOfSpeech: ["n"],
        },
        "1593670:1867082528": {
          jpdbId: [1593670, 1867082528],
          dictionary: "探す",
          reading: [
            {
              text: "探",
              reading: "さが",
            },
            {
              text: "す",
              reading: null,
            },
          ],
          meanings: [
            "to search for; to look for; to hunt for; to seek",
            "to search (a house, pocket, etc.); to search through; to rummage in (e.g. a drawer); to fish around",
          ],
          ranking: 600,
          partsOfSpeech: ["vt", "v5", "v5s"],
        },
      },
      tokens: [
        {
          type: "vocabulary",
          id: "1365360:2487824958",
          literal: "親方",
          dictionary: "親方",
          reading: [
            {
              text: "親",
              reading: "おや",
            },
            {
              text: "方",
              reading: "かた",
            },
          ],
        },
        {
          type: "text",
          text: "を",
        },
        {
          type: "vocabulary",
          id: "1593670:1867082528",
          literal: "探してる",
          reading: [
            {
              text: "探",
              reading: "さが",
            },
            {
              text: "してる",
              reading: null,
            },
          ],
          dictionary: "探す",
        },
        {
          type: "text",
          text: "の",
        },
      ],
    });
  });
});
