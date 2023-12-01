"use client";

import React from "react";
import { useCompletion } from "ai/react";

export function ChatForm({ sentence }: { sentence: string }) {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    body: { sentence },
  });

  return (
    <div className="divide-y divide-gray-7 sticky top-0 -mb-px">
      <form
        className="flex p-2 bg-gray-1 border-b border-gray-7"
        onSubmit={handleSubmit}
      >
        <input
          className="h-10 pl-2 w-full bg-gray-1 placeholder:text-gray-10"
          value={input}
          placeholder="Ask something about this text..."
          onChange={handleInputChange}
        />
        <button className="h-10 bg-gray-12 text-gray-1 py-1 px-3 rounded-md font-medium">
          Ask
        </button>
      </form>
      {completion && (
        <div className="whitespace-pre-wrap p-4">{completion}</div>
      )}
    </div>
  );
}
