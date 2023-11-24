import { Script } from "./script";

const API_BASE_URL = `https://trailsinthedatabase.com/api/script/detail`;

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    {
      gameId: "1",
      scriptId: "c0100",
    },
  ];
}

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
    <div className="p-16">
      <Script script={data} />
    </div>
  );
}
