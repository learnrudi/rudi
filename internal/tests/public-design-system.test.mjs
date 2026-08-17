import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicRoot = path.join(repoRoot, "public");

async function walk(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, extension);
    return fullPath.endsWith(extension) ? [fullPath] : [];
  }));
  return files.flat();
}

const htmlFiles = await walk(publicRoot, ".html");
const cssFiles = await walk(path.join(publicRoot, "css"), ".css");

test("every public page loads an approved RUDI design layer", async () => {
  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    const hasCurrentDesign = /href=["']\/css\/rudi-2026\.css["']/i.test(html);
    const hasLegacyBridge = /href=["']\/css\/rudi-legacy\.css["']/i.test(html);
    assert.ok(
      hasCurrentDesign || hasLegacyBridge,
      `${path.relative(publicRoot, filePath)} is missing an approved RUDI design layer`,
    );

    if (/src=["']\/js\/legacy-positioning\.js["']/i.test(html)) {
      assert.ok(
        hasLegacyBridge,
        `${path.relative(publicRoot, filePath)} loads the legacy shell without its RUDI design bridge`,
      );
    }
  }
});

test("public pages use the RUDI palette instead of the retired clay palette", async () => {
  const retiredClay = /#(?:c75b39|a94d2f|f7e8e1|bd5a3f|8f3f2b)|rgba\(\s*(?:199\s*,\s*91\s*,\s*57|169\s*,\s*77\s*,\s*47)/i;

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    assert.doesNotMatch(
      html,
      retiredClay,
      `${path.relative(publicRoot, filePath)} still contains retired clay colors`,
    );
  }
});

test("public styles do not use decorative side-border declarations", async () => {
  for (const filePath of [...htmlFiles, ...cssFiles]) {
    const content = await readFile(filePath, "utf8");
    assert.doesNotMatch(
      content,
      /border-(?:left|right)\s*:/i,
      `${path.relative(publicRoot, filePath)} contains a left or right border declaration`,
    );
  }
});

test("public contact links use the RUDI admin address", async () => {
  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    const mailtoLinks = [...html.matchAll(/href=["']mailto:([^?"']+)/gi)];
    for (const [, address] of mailtoLinks) {
      assert.equal(
        address.toLowerCase(),
        "rudi@learnrudi.com",
        `${path.relative(publicRoot, filePath)} uses a non-admin contact address`,
      );
    }
    assert.doesNotMatch(html, /hoff@learnrudi\.com|P&amp;P Management Group|P&P Management Group/i);
    assert.doesNotMatch(
      html,
      /(?:©|&copy;)\s*2026 RUDI(?! LLC)/i,
      `${path.relative(publicRoot, filePath)} has a footer that omits the legal entity`,
    );
  }
});
