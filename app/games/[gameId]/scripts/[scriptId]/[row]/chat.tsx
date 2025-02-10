"use client";

import { useCompletion } from "ai/react";
import React from "react";

export function ChatForm({ sentence }: { sentence: string }) {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    body: { sentence },
  });

  return (
    <div className="sticky bottom-0 -m-8 mt-6 bg-sand-1 rounded-tl-xl rounded-tr-xl border border-sand-4 divide-y divide-sand-4">
      {completion && (
        <div className="whitespace-pre-wrap py-6 px-8 text-sm">
          {completion}
        </div>
      )}
      <form className="flex px-8 items-center" onSubmit={handleSubmit}>
        <input
          className="py-6 w-full bg-transparent placeholder:text-sand-10 focus:outline-none"
          value={input}
          placeholder="Ask something about this text..."
          onChange={handleInputChange}
        />
        <button className="bg-gray-12 text-gray-1 px-2 py-1 rounded-md font-medium">
          Ask
        </button>
      </form>
    </div>
  );
}
