import { kv } from "@vercel/kv";

export default async function Favourites() {
  const words = await kv.keys("nanda:favourites:*");
  return (
    <ul className="max-w-[600px] mx-auto my-16 border rounded-xl divide-y">
      {words.map((key) => (
        <Word key={key} keyName={key} />
      ))}
    </ul>
  );
}

async function Word({ keyName }: { keyName: string }) {
  const word = await kv.get<any>(keyName);
  return (
    <li className="grid grid-cols-2 divide-x items-center">
      <div className="p-4 flex items-center justify-between">
        <p className="text-2xl">{word.dictionary || word.word}</p>
        <p className="text-gray-500">{word.reading}</p>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p>{word.meaning}</p>
        <div className="flex gap-2">
          <p className="text-sm text-gray-700 bg-gray-100 w-fit px-2 py-1 rounded-md">
            {word.type}
          </p>
        </div>
      </div>
    </li>
  );
}
