import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheetUrl = new URL("../../public/css/rudi-2026.css", import.meta.url);
const stylesheet = await readFile(stylesheetUrl, "utf8");

test("publishes the RUDI core and spectrum palette", () => {
  assert.match(stylesheet, /--ink:\s*#15151a;/i);
  assert.match(stylesheet, /--paper:\s*#f6f6f2;/i);
  assert.match(stylesheet, /--accent:\s*#4355d8;/i);
  assert.match(stylesheet, /--teal:\s*#1f7f79;/i);
  assert.match(stylesheet, /--coral:\s*#d95f49;/i);
  assert.match(stylesheet, /--gold:\s*#d3a62c;/i);
  assert.match(stylesheet, /--violet:\s*#7657c9;/i);
});

test("does not use the Claude-like clay palette", () => {
  assert.doesNotMatch(stylesheet, /--clay(?:-dark)?:/i);
  assert.doesNotMatch(stylesheet, /#(?:bd5838|934127|efaa8e)/i);
});

test("does not use decorative left or right border declarations", () => {
  assert.doesNotMatch(stylesheet, /border-(?:left|right)\s*:/i);
});
