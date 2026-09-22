import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homepage = await readFile(
  new URL("../../public/index.html", import.meta.url),
  "utf8",
);

test("homepage presents the approved entry points and aggregate engagement scope", () => {
  const main = homepage.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  for (const href of [
    '/how-we-help/ai-readiness/assessment/',
    '/how-we-help/ai-enablement/workforce-programs/',
    '/how-we-help/managed-digital-workers/',
    '/case-studies/#speaking', '/learn/',
    '/insights/workplace-ai-enablement-playbook/', '/insights/rudi-daily/',
  ]) assert.ok(main.includes(`href="${href}"`), `missing homepage entry: ${href}`);
  assert.match(main, /5,000\+<\/strong><span>Employees engaged/);
  assert.match(main, /AI adoption creates organizational questions before it creates technology answers/);
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
  assert.match(homepage, /Start a readiness conversation/);
  assert.match(homepage, /Our home region/);
  assert.match(homepage, /Home in Cincinnati · Serving organizations nationally/);
});
