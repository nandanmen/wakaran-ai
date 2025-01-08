import { streamText, convertToCoreMessages } from "ai";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai/",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: `Given the following sentence from the Trails in the Sky JRPG series, answer the following questions. Sentence: ${data.sentence}. Be precise and concise.`,
        },
        ...convertToCoreMessages(messages),
      ],
      stream: true,
    }),
  };

  const response = await fetch(
    "https://api.perplexity.ai/chat/completions",
    options
  );
  if (!response.body) {
    throw new Error("No response body");
  }
  const stream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk.data);
        },
      })
    );

  return new Response(stream);
}
