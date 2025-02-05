export const get = async <Type>(key: string): Promise<Type | null> => {
  const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });
  const { result } = await response.json();
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
};

export const set = async <Type>(key: string, value: Type) => {
  const response = await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });
  return response.json();
};
