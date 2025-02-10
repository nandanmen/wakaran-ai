import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
	convertToCoreMessages,
	createDataStreamResponse,
	streamText,
} from "ai";

const perplexity = createOpenAICompatible({
	name: "perplexity",
	apiKey: process.env.PERPLEXITY_API_KEY,
	baseURL: "https://api.perplexity.ai/",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, data } = await req.json();
	return createDataStreamResponse({
		execute: (dataStream) => {
			let citations: string[] = [];
			const result = streamText({
				model: perplexity("llama-3.1-sonar-small-128k-online"),
				system: `Given the following sentence from the Trails in the Sky JRPG series, answer the following questions. Be concise - you do not need to repeat the sentence. Sentence: ${data.sentence}`,
				messages: convertToCoreMessages(messages),
				onChunk({ chunk }) {
					if ("citations" in chunk) {
						citations = chunk.citations as string[];
					}
				},
				onFinish() {
					dataStream.writeData({ citations });
				},
			});
			result.mergeIntoDataStream(dataStream);
		},
		onError: (error) => {
			// Error messages are masked by default for security reasons.
			// If you want to expose the error message to the client, you can do so here:
			return error instanceof Error ? error.message : String(error);
		},
	});
}
