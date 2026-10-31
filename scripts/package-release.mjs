import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
const release = path.join(root, `dist/release/grimmoire-${manifest.version}`);

await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });
for (const file of ["manifest.json", "versions.json", "theme.css"]) {
  await copyFile(path.join(root, file), path.join(release, file));
}
await copyFile(path.join(root, "dist/web/grimmoire-web.css"), path.join(release, "grimmoire-web.css"));
await copyFile(path.join(root, "dist/web/grimmoire-web.min.css"), path.join(release, "grimmoire-web.min.css"));

console.log(`Staged release assets in ${path.relative(root, release)}`);
