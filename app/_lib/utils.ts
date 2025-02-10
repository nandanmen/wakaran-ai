export const profile = async <T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> => {
  const start = Date.now();
  const result = await fn();
  const end = Date.now();
  console.log(`[${name}] ${end - start}ms`);
  return result;
};
