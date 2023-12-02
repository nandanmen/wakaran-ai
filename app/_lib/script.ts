const API_BASE_URL = `https://trailsinthedatabase.com/api/script/detail`;

export async function getScript({
  gameId,
  scriptId,
}: {
  gameId: string;
  scriptId: string;
}) {
  const response = await fetch(`${API_BASE_URL}/${gameId}/${scriptId}`);
  return response.json();
}

export async function getRow({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}) {
  const script = await getScript({ gameId, scriptId });
  return script.at(row - 1);
}
