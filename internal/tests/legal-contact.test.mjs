import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPublicFile = (path) =>
  readFile(new URL(`../../public/${path}`, import.meta.url), "utf8");

const [privacy, terms, startHere] = await Promise.all([
  readPublicFile("privacy.html"),
  readPublicFile("terms.html"),
  readPublicFile("start-here/index.html"),
]);

test("publishes RUDI LLC as the legal entity on both legal pages", () => {
  for (const page of [privacy, terms]) {
    assert.match(page, /RUDI LLC/);
    assert.doesNotMatch(page, /P&amp;P Management Group LLC|P&P Management Group LLC/);
    assert.match(page, /(?:Updated|Last updated) August 2026/);
  }
});

test("uses the RUDI admin email across legal and contact surfaces", () => {
  for (const page of [privacy, terms, startHere]) {
    assert.match(page, /mailto:rudi@learnrudi\.com/);
    assert.match(page, />rudi@learnrudi\.com</);
    assert.doesNotMatch(page, /hoff@learnrudi\.com/);
  }
});

test("legal pages do not route visitors to legacy RUDI sites", () => {
  for (const page of [privacy, terms]) {
    assert.doesNotMatch(page, /learnrudi\.github\.io|hoffdigital\.com/i);
  }
});
