import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `Given the following sentence from the Trails in the Sky JRPG series, answer the following questions. Sentence: ${data.sentence}`,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
