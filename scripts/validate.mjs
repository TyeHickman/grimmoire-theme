import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
const versions = JSON.parse(await readFile(path.join(root, "versions.json"), "utf8"));
const packageMetadata = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const failures = [];

if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) failures.push("manifest version must use semantic versioning");
if (!manifest.name || !manifest.author || !manifest.minAppVersion) failures.push("manifest is missing required metadata");
if (versions[manifest.version] !== manifest.minAppVersion) failures.push("versions.json must map the current version to minAppVersion");
if (packageMetadata.version !== manifest.version) failures.push("package.json and manifest.json versions differ");

const artifacts = [
  "theme.css",
  "dist/obsidian/theme.css",
  "dist/obsidian/manifest.json",
  "dist/web/grimmoire-web.css",
  "dist/web/grimmoire-web.min.css"
];

for (const file of artifacts) {
  try {
    if ((await stat(path.join(root, file))).size === 0) failures.push(`${file} is empty`);
  } catch {
    failures.push(`${file} is missing`);
  }
}

function balanced(css) {
  let depth = 0;
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

const obsidianCss = await readFile(path.join(root, "theme.css"), "utf8");
const stagedObsidianCss = await readFile(path.join(root, "dist/obsidian/theme.css"), "utf8");
const webCss = await readFile(path.join(root, "dist/web/grimmoire-web.css"), "utf8");

if (obsidianCss !== stagedObsidianCss) failures.push("root and staged Obsidian CSS differ");
if (!obsidianCss.includes(`Grimmoire ${manifest.version}`)) failures.push("Obsidian banner version is stale");
if (!webCss.includes(`Grimmoire Web ${manifest.version}`)) failures.push("web banner version is stale");
if (!balanced(obsidianCss) || !balanced(webCss)) failures.push("generated CSS has unbalanced braces");
if (obsidianCss.includes(":root")) failures.push("shared variables must remain scoped to Obsidian's dark theme");
if (/\.theme-dark|\.workspace-|\.markdown-(?:source|preview|rendered)/.test(webCss)) failures.push("Obsidian selectors leaked into the web artifact");
if (!webCss.includes("--grim-void") || !webCss.includes("prefers-reduced-motion")) failures.push("web artifact lacks required tokens or accessibility behavior");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Validated Grimmoire ${manifest.version} release artifacts.`);
