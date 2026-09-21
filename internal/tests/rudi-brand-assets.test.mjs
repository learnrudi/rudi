import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicRoot = path.join(repoRoot, "public");

const requiredSvgAssets = [
  ["square mark", new URL("../../public/brand/rudi-mark.svg", import.meta.url)],
  ["lowercase wordmark", new URL("../../public/brand/rudi-wordmark.svg", import.meta.url)],
  ["favicon", new URL("../../public/favicon.svg", import.meta.url)],
];

const requiredPngAssets = [
  ["advertiser mark", new URL("../../public/brand/rudi-mark-512.png", import.meta.url), 512, 512],
  ["lowercase wordmark", new URL("../../public/brand/rudi-wordmark-1200.png", import.meta.url), 1200, 550],
  ["Apple touch icon", new URL("../../public/apple-touch-icon.png", import.meta.url), 180, 180],
  ["PNG favicon", new URL("../../public/favicon-64.png", import.meta.url), 64, 64],
];

async function pngDimensions(assetUrl) {
  const png = await readFile(assetUrl);
  assert.equal(png.subarray(1, 4).toString("ascii"), "PNG", `${assetUrl.pathname} is not a PNG`);
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

async function walkHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkHtml(fullPath);
    return fullPath.endsWith(".html") ? [fullPath] : [];
  }));
  return files.flat();
}

test("publishes original vector brand assets in the approved RUDI system", async () => {
  for (const [label, assetUrl] of requiredSvgAssets) {
    const svg = await readFile(assetUrl, "utf8");
    assert.match(svg, /<svg\b/i, `${label} is not an SVG document`);
    assert.match(svg, /#1fb8a8/i, `${label} is missing the RUDI teal node`);
    assert.doesNotMatch(svg, /#(?:c75b39|a94d2f|f7e8e1|bd5838|934127|efaa8e)/i, `${label} contains retired clay colors`);
  }

  const wordmark = await readFile(requiredSvgAssets[1][1], "utf8");
  assert.match(wordmark, /<title[^>]*>rudi wordmark<\/title>/i);
  assert.match(wordmark, /<path[^>]*fill="#15181F"/i);
  assert.doesNotMatch(wordmark, /<text\b/i, "production letterforms must use the traced paths");
});

test("publishes raster exports at their required delivery sizes", async () => {
  for (const [label, assetUrl, width, height] of requiredPngAssets) {
    assert.deepEqual(
      await pngDimensions(assetUrl),
      { width, height },
      `${label} has the wrong dimensions`,
    );
  }
});

test("keeps the monogram separate from the wordmark", async () => {
  const assets = await readdir(path.join(publicRoot, 'brand'));
  assert.ok(!assets.some(name => name.startsWith('rudi-lockup')), 'retired combined lockups must not ship');
  const homepage = await readFile(path.join(publicRoot, 'index.html'), 'utf8');
  assert.doesNotMatch(homepage, /wordmark-mark|rudi-lockup/);
  assert.match(homepage, /class="rudi-wordmark"[^>]*>[\s\S]*?src="\/brand\/rudi-wordmark\.svg"/);
});

test("declares the canonical RUDI icons on every public page and future daily editions", async () => {
  const htmlFiles = await walkHtml(publicRoot);
  assert.ok(htmlFiles.length > 0, "no public HTML pages were found");

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    assert.equal(
      html.match(/<link rel=["']icon["'] href=["']\/favicon-64\.png["'] type=["']image\/png["']>/gi)?.length ?? 0,
      1,
      `${path.relative(publicRoot, filePath)} must declare the generated-mark favicon exactly once`,
    );
    assert.equal(
      html.match(/<link rel=["']apple-touch-icon["'] href=["']\/apple-touch-icon\.png["']>/gi)?.length ?? 0,
      1,
      `${path.relative(publicRoot, filePath)} must declare the Apple touch icon exactly once`,
    );
  }

  const dailyBuilder = await readFile(new URL("../scripts/build_daily_edition.py", import.meta.url), "utf8");
  assert.match(dailyBuilder, /href="\/favicon-64\.png" type="image\/png"/i);
  assert.match(dailyBuilder, /href="\/apple-touch-icon\.png"/i);
});

test("publishes real absolute logo URLs in organization and publisher metadata", async () => {
  const canonicalLogo = "https://learnrudi.com/brand/rudi-mark-512.png";
  const homepage = await readFile(new URL("../../public/index.html", import.meta.url), "utf8");
  const prompting = await readFile(new URL("../../public/prompting.html", import.meta.url), "utf8");

  assert.match(homepage, new RegExp(`"logo"\\s*:\\s*"${canonicalLogo.replaceAll(".", "\\.")}"`));
  assert.match(prompting, new RegExp(canonicalLogo.replaceAll(".", "\\.")));
  assert.doesNotMatch(prompting, /https:\/\/learnrudi\.com\/images\/rudi-logo\.png/i);
});
