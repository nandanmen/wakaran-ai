"use client";

import React from "react";
import { SubmitButton } from "./script";
import styles from "./comment.module.css";

export function CommentForm({
  saveComment,
  currentComment,
  context,
}: {
  saveComment: (data: FormData) => Promise<void>;
  currentComment?: {
    html: string;
    text: string;
  };
  context: {
    gameId: string;
    scriptId: string;
    row: number;
  };
}) {
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="space-y-2">
      <h3 className="text-gray-11 font-medium text-sm p-4 pb-0 flex justify-between">
        <span>Notes</span>
        {editing ? (
          <button onClick={() => setEditing(false)}>Cancel</button>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </h3>
      {editing ? (
        <form
          className="flex flex-col"
          action={async (data) => {
            await saveComment(data);
            setEditing(false);
          }}
        >
          <textarea
            className="bg-gray-1 h-[100px] resize-y placeholder:text-gray-10 w-full px-4"
            name="comment"
            defaultValue={currentComment?.text}
            placeholder="Leave some notes about this text..."
          />
          <input type="hidden" value={context.gameId} name="gameId" />
          <input type="hidden" value={context.scriptId} name="scriptId" />
          <input type="hidden" value={context.row} name="row" />
          <div className="flex p-4 border-t border-gray-7 justify-end">
            <SubmitButton>Save Note</SubmitButton>
          </div>
        </form>
      ) : currentComment ? (
        <div
          className={`p-4 pt-0 ${styles.comment}`}
          dangerouslySetInnerHTML={{ __html: currentComment.html }}
        />
      ) : (
        <div className="p-4 pt-0 text-gray-10">
          No notes yet. Click edit to add some.
        </div>
      )}
    </div>
  );
}
