import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homepage = await readFile(
  new URL("../../public/index.html", import.meta.url),
  "utf8",
);

test("homepage keeps one inquiry path and a focused set of proof links", () => {
  const main = homepage.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const destinations = new Set([
    '/start-here/#inquiry-form',
    '/case-studies/',
    '/insights/about-rudi-daily/',
    'https://marketplace.microsoft.com/en-us/partners/bfe8f935-a193-4e89-a940-9aa43d659961/overview',
  ]);
  for (const [, href] of main.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    assert.ok(destinations.has(href), `competing homepage destination: ${href}`);
  }
  assert.deepEqual(
    [...main.matchAll(/<a class="button" href="([^"]+)"/g)].map(([, href]) => href),
    ['/start-here/#inquiry-form', '/start-here/#inquiry-form'],
    'the opening and closing calls to action should offer the same general inquiry',
  );
  for (const href of destinations) assert.ok(main.includes(`href="${href}"`));
  assert.match(main, /5,000\+<\/strong><span>Employees engaged/);
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

test("homepage preserves its primary conversion and regional positioning", () => {
  const hero = homepage.match(/<section class="bright-hero">([\s\S]*?)<\/section>/)[1];
  assert.match(hero, /class="button" href="\/start-here\/#inquiry-form"/,
    "the primary inquiry must support people, agents and governance without preselecting training");
  assert.match(homepage, /Our home region/);
  assert.match(homepage, /Home in Cincinnati · Serving organizations nationally/);
});
