import path from "path";
import { cache } from "react";
import * as fs from "fs/promises";

export const getTranslation = cache(async function getTranslation(key: string) {
  const [, scriptId] = key.split(":");
  const file = await fs.readFile(
    path.join(process.cwd(), "translation", `${scriptId}.json`),
    "utf-8"
  );
  const parsed = JSON.parse(file);
  return parsed[key];
});

export const getScript = cache(async function getScript(scriptId: string) {
  const file = await fs.readFile(
    path.join(process.cwd(), "scripts", `${scriptId}.json`),
    "utf-8"
  );
  const parsed = JSON.parse(file);
  return parsed;
});
