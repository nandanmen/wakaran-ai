import { Params } from "../types";
import { Suspense } from "react";

export default function NotesPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={null}>
      <NotesLoader params={params} />
    </Suspense>
  );
}

async function NotesLoader({ params }: { params: Params }) {
  return (
    <form className="py-2 h-full">
      <textarea
        className="bg-transparent h-full w-full text-sm placeholder:text-sand-10"
        placeholder="Note something down about this text..."
      />
    </form>
  );
}
