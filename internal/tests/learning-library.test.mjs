import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libraryPath = path.join(repoRoot, "public/learn/index.html");
const libraryHtml = existsSync(libraryPath) ? readFileSync(libraryPath, "utf8") : "";
const libraryCssPath = path.join(repoRoot, "public/css/rudi-learn.css");
const libraryCss = existsSync(libraryCssPath) ? readFileSync(libraryCssPath, "utf8") : "";
const libraryScriptPath = path.join(repoRoot, "public/js/rudi-learn.js");
const libraryScript = existsSync(libraryScriptPath) ? readFileSync(libraryScriptPath, "utf8") : "";
const homepageHtml = readFileSync(path.join(repoRoot, "public/index.html"), "utf8");
const sharedHeader = readFileSync(path.join(repoRoot, "public/js/header.js"), "utf8");
const sharedFooter = readFileSync(path.join(repoRoot, "public/js/footer.js"), "utf8");

const expectedVideoIds = new Set([
  "27RjvlXmkRw",
  "Tk-SxtaeSbA",
  "Hi3v4nwxGVw",
  "hWuQeMD2pR4",
  "HrGXwE_Vo1s",
  "x7kq6udvgb8",
  "tktszPnaiRc",
  "NMMPSDr9Bv4",
  "7fhp5zwfzl8",
  "LgAshETu4S8",
  "oHyS2AdAi-o",
  "DWhDaIRXpzk",
  "okeDTmYlkZE",
  "FJaD3x8Mx8E",
  "qqt77ZRm5dg",
  "dneLfxWrS0A",
  "RZ-TFzuhxIY",
  "Z6iuUKlowqo",
  "-zbu2Fwg_Gs",
  "iM45dv9WwsM",
  "hcx8V6DBv1k",
]);

test("learning library exposes the complete verified video catalog", () => {
  const catalogIds = [...libraryScript.matchAll(/videoId:\s*"([^"]+)"/g)].map((match) => match[1]);
  const uniqueCatalogIds = new Set(catalogIds);

  assert.equal(catalogIds.length, 21, "library must declare exactly 21 lessons");
  assert.equal(uniqueCatalogIds.size, 21, "every lesson must use a unique YouTube video");
  assert.deepEqual(uniqueCatalogIds, expectedVideoIds, "library video IDs must match the verified catalog");
});

test("learning library preserves the approved course-player experience", () => {
  assert.match(libraryHtml, /youtube-nocookie\.com\/embed\//);
  assert.match(libraryHtml, /class="learn-curriculum"/);
  assert.match(libraryHtml, /class="learn-viewer"/);
  assert.match(libraryHtml, /id="lesson-summary"/);
  assert.match(libraryHtml, /id="youtube-link"/);
  assert.equal((libraryHtml.match(/class="learn-course-tab"/g) || []).length, 3);
  assert.match(libraryCss, /\.learn-shell\s*\{[\s\S]*?grid-template-columns:/);
  assert.match(libraryCss, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.learn-viewer\s*\{[\s\S]*?grid-row:\s*1;/);
});

test("learning library uses the current RUDI shell and conversion path", () => {
  assert.match(libraryHtml, /href="\/css\/rudi-2026\.css"/);
  assert.match(libraryHtml, /href="\/css\/rudi-learn\.css"/);
  assert.match(libraryHtml, /src="\/js\/rudi-2026\.js"/);
  assert.match(libraryHtml, /href="\/start-here\/"/);
  assert.match(libraryHtml, /© 2026 RUDI LLC/);
  assert.doesNotMatch(libraryHtml, /#(?:c75b39|a94d2f|bd5a3f|8f3f2b)/i);
});

test("homepage and shared legacy chrome link to the learning library", () => {
  for (const [name, content] of [
    ["homepage", homepageHtml],
    ["shared footer", sharedFooter],
  ]) {
    assert.match(content, /href=["']\/learn\//, `${name} must link to /learn/`);
  }
  assert.match(sharedHeader, /["']\/learn\/["']/, "shared header must configure /learn/");
  assert.match(homepageHtml, /class="[^"]*home-learning-band/);
});
