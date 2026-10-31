import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));

function commitId() {
  return process.env.GRIMMOIRE_SOURCE_COMMIT?.slice(0, 12) || "unreleased";
}

async function combine(files) {
  const sections = await Promise.all(files.map((file) => readFile(path.join(root, file), "utf8")));
  return `${sections.map((section) => section.trim()).join("\n\n")}\n`;
}

function minify(css) {
  return css
    .replace(/\/\*(?!\!)[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .trim();
}

const shared = [
  "src/shared/tokens.css",
  "src/shared/typography.css",
  "src/shared/effects.css"
];
const obsidian = [
  ...shared,
  "src/obsidian/variables.css",
  "src/obsidian/workspace.css",
  "src/obsidian/editor.css",
  "src/obsidian/content.css",
  "src/obsidian/surfaces.css",
  "src/obsidian/accessibility.css"
];
const web = [
  ...shared,
  "src/web/variables.css",
  "src/web/reset.css",
  "src/web/document.css",
  "src/web/components.css",
  "src/web/accessibility.css"
];

const obsidianBanner = `/*\n * Grimmoire ${manifest.version}\n * Generated Obsidian theme. Edit src/, then run npm run build.\n */\n\n`;
const webBanner = `/*! Grimmoire Web ${manifest.version} | source ${commitId()} | generated artifact */\n\n`;
const obsidianCss = obsidianBanner + (await combine(obsidian)).replaceAll(":root", ".theme-dark");
const webCss = webBanner + await combine(web);

await mkdir(path.join(root, "dist/obsidian"), { recursive: true });
await mkdir(path.join(root, "dist/web"), { recursive: true });
await writeFile(path.join(root, "theme.css"), obsidianCss);
await writeFile(path.join(root, "dist/obsidian/theme.css"), obsidianCss);
await copyFile(path.join(root, "manifest.json"), path.join(root, "dist/obsidian/manifest.json"));
await copyFile(path.join(root, "versions.json"), path.join(root, "dist/obsidian/versions.json"));
await writeFile(path.join(root, "dist/web/grimmoire-web.css"), webCss);
await writeFile(path.join(root, "dist/web/grimmoire-web.min.css"), `${webBanner}${minify(await combine(web))}\n`);

console.log(`Built Grimmoire ${manifest.version}: theme.css and dist/web/grimmoire-web.css`);
