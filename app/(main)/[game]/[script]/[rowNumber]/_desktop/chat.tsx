"use client";

import { useChat } from "ai/react";
import clsx from "clsx";

export function Chat({ sentence }: { sentence: string }) {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  // @ts-ignore
  const citations = data?.at(0)?.citations;
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
            <p>{m.content}</p>
            {citations && m.role !== "user" && (
              <ol className="list-decimal pl-4">
                {citations.map((c: string) => {
                  return (
                    <li key={c}>
                      <a href={c} target="_blank" rel="noopener noreferrer">
                        {c}
                      </a>
                    </li>
                  );
                })}
              </ol>
            )}
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
