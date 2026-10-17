import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { build } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const destination = path.resolve(
  root,
  process.argv[2] || "preview/conjumate-preview.html",
);
const mimeTypes = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

async function dataUrl(file) {
  const bytes = await readFile(file);
  const type = mimeTypes[path.extname(file)];
  if (!type) throw new Error(`Unsupported embedded asset: ${file}`);
  return `data:${type};base64,${bytes.toString("base64")}`;
}

let html = await readFile(path.join(dist, "index.html"), "utf8");
const scriptTag = html.match(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/);
const styleTag = html.match(
  /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,
);
if (!scriptTag || !styleTag)
  throw new Error(
    "Build the site with npm run build before exporting the preview.",
  );

let script = await readFile(
  path.join(dist, scriptTag[1].replace(/^\//, "")),
  "utf8",
);
let css = await readFile(
  path.join(dist, styleTag[1].replace(/^\//, "")),
  "utf8",
);

// Render the same React app up front so the preview never starts with an empty
// root, including in file viewers that disable JavaScript. Interactive controls
// use the normal production bundle when JavaScript is supported.
const cache = path.join(root, "node_modules", ".cache");
await mkdir(cache, { recursive: true });
const temporary = await mkdtemp(path.join(cache, "conjumate-preview-"));
let markup;
try {
  const output = await build({
    root,
    logLevel: "error",
    build: { ssr: "src/App.jsx", outDir: temporary, emptyOutDir: true },
  });
  const entry = output.output.find(
    (file) => file.type === "chunk" && file.isEntry,
  );
  const { default: App } = await import(
    pathToFileURL(path.join(temporary, entry.fileName)).href
  );
  markup = renderToString(createElement(App));
} finally {
  await rm(temporary, { recursive: true, force: true });
}

// Embed all production assets so opening a
// downloaded copy needs neither a server nor a network connection.
const references = new Set(
  (script + markup + css).match(/\/assets\/[A-Za-z0-9_.-]+/g) || [],
);
for (const reference of references) {
  const embedded = await dataUrl(path.join(dist, reference.slice(1)));
  script = script.replaceAll(reference, embedded);
  markup = markup.replaceAll(reference, embedded);
  css = css.replaceAll(reference, embedded);
}

html = html.replace(scriptTag[0], "");
html = html.replace(
  styleTag[0],
  () => `<style>${css.replaceAll("</style", "<\\/style")}</style>`,
);
html = html.replace(/<link\b[^>]*href="https:\/\/fonts\.[^>]*>\s*/g, "");
html = html.replace(
  'href="/favicon.svg"',
  `href="${await dataUrl(path.join(dist, "favicon.svg"))}"`,
);
html = html.replace(
  '<div id="root"></div>',
  () => `<div id="root">${markup}</div>`,
);
html = html.replace(
  "</body>",
  () =>
    `<script type="module">${script.replaceAll("</script", "<\\/script")}\ndocument.documentElement.dataset.previewReady = 'true';</script></body>`,
);
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Standalone preview: ${destination}`);
