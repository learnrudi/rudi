import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homepage = await readFile(
  new URL("../../public/index.html", import.meta.url),
  "utf8",
);

test("homepage uses open editorial composition patterns", () => {
  for (const className of [
    "home-stage-index",
    "home-readiness-feature",
    "home-process-list",
    "home-case-list",
    "home-region-note",
    "home-insights-list",
  ]) {
    assert.match(homepage, new RegExp(`class="[^"]*\\b${className}\\b`));
  }
});

test("homepage does not reuse the generic card and panel layouts", () => {
  for (const className of [
    "continuum-card",
    "feature-panel",
    "numbered-grid",
    "numbered-card",
    "card-grid",
    "card",
    "regional-panel",
  ]) {
    assert.doesNotMatch(
      homepage,
      new RegExp(`class="[^"]*\\b${className}\\b`),
      `homepage still uses ${className}`,
    );
  }
});

test("homepage preserves its primary conversion and concise regional positioning", () => {
  assert.match(homepage, /Start a readiness conversation/);
  assert.match(homepage, /Established in Cincinnati\. Serving organizations nationally\./);
  assert.match(homepage, /Home in Cincinnati · Serving organizations nationally/);
  assert.doesNotMatch(homepage, /Greater Cincinnati economic indicators/);
  assert.doesNotMatch(homepage, /Cincy AI Week 2026/);
});
