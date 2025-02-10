"use client";

export function NoteForm({
	initialValue,
	saveComment,
}: {
	initialValue?: string;
	saveComment: (comment: string) => Promise<void>;
}) {
	return (
		<form className="py-2 h-full">
			<textarea
				name="comment"
				className="bg-transparent h-full w-full text-sm placeholder:text-sand-10 leading-relaxed"
				placeholder="Note something down about this text..."
				defaultValue={initialValue}
				onBlur={(e) => saveComment(e.target.value)}
			/>
		</form>
	);
}
