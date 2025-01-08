"use client";

import { useChat } from "ai/react";
import clsx from "clsx";
import { useState } from "react";

export function Chat({ sentence }: { sentence: string }) {
  const [messages, setMessages] = useState<
    { id: string; role: string; content: string }[]
  >([]);
  return (
    <div className="flex flex-col h-full text-sm">
      <div className="divide-y divide-dashed divide-sand-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              "whitespace-pre-wrap py-4",
              m.role === "user" ? "" : "pl-4"
            )}
          >
            {m.content}
          </div>
        ))}
      </div>
      <form
        className="mt-auto"
        onSubmit={async (evt) => {
          evt.preventDefault();

          const formData = new FormData(evt.target as HTMLFormElement);
          const question = formData.get("question") as string;
          if (!question) return;

          setMessages([
            ...messages,
            { id: crypto.randomUUID(), role: "user", content: question },
          ]);

          const response = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
              data: { sentence },
              messages: [{ role: "user", content: question }],
            }),
          });
          if (!response.ok) return;
          const reader = response.body
            ?.pipeThrough(new TextDecoderStream())
            .getReader();
          if (!reader) return;
          const chunks = [];
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            console.log({ value });
            chunks.push(JSON.parse(value));
            console.log(chunks);
          }
        }}
      >
        <input
          className="sticky bottom-0 w-full bg-transparent py-2 placeholder:text-sand-10"
          name="question"
          placeholder="Ask a question..."
        />
      </form>
    </div>
  );
}
