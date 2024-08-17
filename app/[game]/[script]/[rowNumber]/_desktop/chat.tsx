"use client";

import { useChat } from "ai/react";
import clsx from "clsx";

export function Chat({ sentence }: { sentence: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
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
        onSubmit={(evt) => {
          handleSubmit(evt, {
            data: { sentence },
          });
        }}
      >
        <input
          className="sticky bottom-0 w-full bg-transparent py-2 placeholder:text-sand-10"
          value={input}
          placeholder="Ask a question..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
