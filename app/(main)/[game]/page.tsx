import { type Game, toGameId } from "@/app/_lib/script";
import { kv } from "@vercel/kv";
import Link from "next/link";

async function getScripts(game: string) {
  const allKeys = await kv.keys("*");
  const gameKeys = allKeys.filter((key) => key.startsWith(`${game}:`));

  const uniqueScripts = new Map<string, number>();
  gameKeys.forEach((key) => {
    const [, script] = key.split(":");
    const count = uniqueScripts.get(script) ?? 0;
    uniqueScripts.set(script, count + 1);
  });

  return Object.fromEntries(uniqueScripts);
}

export default async function GamePage({ params }: { params: { game: Game } }) {
  const keys = await getScripts(toGameId(params.game));
  return (
    <div className="bg-gray-2 min-h-screen flex items-center justify-center">
      <main className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-medium">Trails in the Sky</h1>
        <ul className="divide-y divide-gray-4">
          {Object.entries(keys).map(([script, count]) => {
            return (
              <li key={script}>
                <Link
                  className="py-4 font-mono flex justify-between hover:bg-gray-3"
                  href={`/${params.game}/${script}/1`}
                >
                  <span>{script}</span>
                  <span className="text-gray-11">{count} lines</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
