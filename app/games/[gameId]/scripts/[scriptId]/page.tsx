import { Script } from "./script";

const API_BASE_URL = `https://trailsinthedatabase.com/api/script/detail`;

export const dynamic = "force-dynamic";

export default async function ScriptPage({
  params,
}: {
  params: { gameId: string; scriptId: string };
}) {
  const response = await fetch(
    `${API_BASE_URL}/${params.gameId}/${params.scriptId}`
  );
  const data = await response.json();
  return (
    <div className="p-12">
      <Script script={data} />
    </div>
  );
}
