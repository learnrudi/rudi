import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesSkill } from '../../public/js/rudi-skills.mjs';

const skill = { id: 'rudi-code-review', title: 'Code Review', category: 'Build & engineering', purpose: 'Review software changes against the agreed requirements.' };

test('search combines words, normalizes case/whitespace and intersects the selected category', () => {
    assert.equal(matchesSkill(skill, '  CODE   requirements ', ''), true);
    assert.equal(matchesSkill(skill, 'code', 'Build & engineering'), true);
    assert.equal(matchesSkill(skill, 'code', 'Content & media'), false);
    assert.equal(matchesSkill(skill, 'unmatched', ''), false);
    assert.equal(matchesSkill(skill, '<img src=x onerror=alert(1)>', ''), false);
    assert.equal(matchesSkill(skill, 'rudi-code-review', ''), true);
    assert.equal(matchesSkill(skill, '', ''), true);
});

import { validateCatalog } from '../scripts/render-skills.mjs';
const catalog = { revision: 'b4bc855c9422a6df1fb6811b14619a01ac57b941', skills: [skill] };

test('catalog rejects invalid or duplicated IDs and unreviewed fields instead of publishing them', () => {
    assert.throws(() => validateCatalog({ ...catalog, skills: [{ ...skill, id: '../private' }] }), /id/i);
    assert.throws(() => validateCatalog({ ...catalog, skills: [skill, skill] }), /duplicate/i);
    assert.throws(() => validateCatalog({ ...catalog, skills: [{ ...skill, localPath: '/private/local' }] }), /field/i);
    assert.throws(() => validateCatalog({ ...catalog, revision: 'main?other' }), /revision/i);
    assert.throws(() => validateCatalog({ ...catalog, skills: [] }), /skills/i);
    assert.throws(() => validateCatalog({ ...catalog, skills: [{ ...skill, category: 'Unknown' }] }), /category/i);
    assert.deepEqual(validateCatalog(catalog), catalog);
});

import { renderCatalog } from '../scripts/render-skills.mjs';
test('rendered catalog treats metadata as text and links only to the pinned public source', () => {
    const markup = renderCatalog({ ...catalog, skills: [{ ...skill, title: '<script>alert(1)</script>', purpose: 'A "quoted" task & <tool>' }] });
    assert.ok(markup.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(markup.includes('A &quot;quoted&quot; task &amp; &lt;tool&gt;'));
    assert.ok(markup.includes(`https://github.com/learnrudi/registry/blob/${catalog.revision}/catalog/skills/rudi-code-review/SKILL.md`));
    assert.doesNotMatch(markup, /<script>/);
});

import { initSkills } from '../../public/js/rudi-skills.mjs';
test('the browser controller updates rows and empty state, then resets both filters', () => {
    const element = () => ({ hidden: true, value: '', textContent: '', events: {}, focused: false,
        addEventListener(type, fn) { this.events[type] = fn; }, focus() { this.focused = true; } });
    const nodes = Object.fromEntries(['controls', 'query', 'category', 'count', 'empty'].map(id => [`#skills-${id}`, element()]));
    const rows = [skill, { ...skill, id: 'video-generator', title: 'Video Generation', category: 'Content & media', purpose: 'Create video.' }].map(data => ({
        dataset: { id: data.id, category: data.category }, hidden: false,
        querySelector(selector) { return { textContent: selector === 'h3' ? data.title : data.purpose }; },
    }));
    const root = { querySelector: selector => nodes[selector], querySelectorAll: () => rows };
    initSkills(root);
    assert.equal(nodes['#skills-controls'].hidden, false);
    nodes['#skills-query'].value = 'video';
    nodes['#skills-query'].events.input();
    assert.deepEqual(rows.map(row => row.hidden), [true, false]);
    assert.equal(nodes['#skills-count'].textContent, '1 of 2 skills');
    nodes['#skills-category'].value = 'Build & engineering';
    nodes['#skills-category'].events.change();
    assert.equal(nodes['#skills-empty'].hidden, false);
    nodes['#skills-controls'].events.reset();
    assert.deepEqual(rows.map(row => row.hidden), [false, false]);
    assert.equal(nodes['#skills-empty'].hidden, true);
    assert.equal(nodes['#skills-query'].focused, true);
});
