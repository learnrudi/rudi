import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheetUrl = new URL("../../public/css/rudi-2026.css", import.meta.url);
const stylesheet = await readFile(stylesheetUrl, "utf8");

test("publishes the bright RUDI canvas with readable ink and deep teal controls", () => {
  assert.match(stylesheet, /--ink:\s*#15181f;/i);
  assert.match(stylesheet, /--paper:\s*#fffdf8;/i);
  assert.match(stylesheet, /--paper-deep:\s*#fbf8f1;/i);
  assert.match(stylesheet, /--accent:\s*#177f74;/i);
  assert.doesNotMatch(stylesheet, /--paper(?:-deep)?:\s*#(?:f2ede3|e6dfd0)/i);
});

test("does not use the Claude-like clay palette", () => {
  assert.doesNotMatch(stylesheet, /--clay(?:-dark)?:/i);
  assert.doesNotMatch(stylesheet, /#(?:bd5838|934127|efaa8e)/i);
});

test("does not use decorative left or right border declarations", () => {
  assert.doesNotMatch(stylesheet, /border-(?:left|right)\s*:/i);
});
