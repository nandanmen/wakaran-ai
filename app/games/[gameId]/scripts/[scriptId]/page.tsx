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
      <ul className="text-lg max-w-[900px] border rounded-xl divide-y">
        {data.map((row) => {
          return (
            <li className="grid grid-cols-2 divide-x" key={row.row}>
              <div className="p-4 space-y-2">
                <h2 className="font-medium">{row.engChrName}</h2>
                <p>{row.engSearchText}</p>
              </div>
              <div className="p-4 space-y-2">
                <h2 className="font-medium">{row.jpnChrName}</h2>
                <p dangerouslySetInnerHTML={{ __html: row.jpnHtmlText }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
