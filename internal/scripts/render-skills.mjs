import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const categories = [
    'Clients & communication', 'Build & engineering', 'Content & media',
    'Design & documents', 'Research & writing', 'Data & finance',
    'Property & development', 'Planning & decisions', 'Apps & automation',
];

function exactFields(value, fields, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
        Object.keys(value).sort().join(',') !== [...fields].sort().join(',')) {
        throw new Error(`${label}: unexpected or missing field`);
    }
}

export function validateCatalog(catalog) {
    exactFields(catalog, ['revision', 'skills'], 'Catalog');
    if (!/^[a-f0-9]{40}$/.test(catalog.revision)) throw new Error('Invalid Registry revision');
    if (!Array.isArray(catalog.skills) || catalog.skills.length === 0) throw new Error('Catalog requires skills');
    const ids = new Set();
    for (const skill of catalog.skills) {
        exactFields(skill, ['id', 'title', 'category', 'purpose'], 'Skill');
        if (typeof skill.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.id) || skill.id.length > 100) {
            throw new Error('Invalid skill id');
        }
        if (ids.has(skill.id)) throw new Error(`Duplicate skill id: ${skill.id}`);
        ids.add(skill.id);
        if (!categories.includes(skill.category)) throw new Error(`Invalid category for ${skill.id}`);
        for (const field of ['title', 'purpose']) {
            if (typeof skill[field] !== 'string' || !skill[field].trim() || skill[field].length > 320) {
                throw new Error(`Invalid ${field} for ${skill.id}`);
            }
        }
    }
    return catalog;
}

export function renderCatalog(catalog) {
    validateCatalog(catalog);
    const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    const options = categories.map(category => {
        const count = catalog.skills.filter(skill => skill.category === category).length;
        return `<option value="${escape(category)}">${escape(category)} (${count})</option>`;
    }).join('\n');
    const rows = catalog.skills.map(skill => `
<article class="skill-row" data-skill data-id="${escape(skill.id)}" data-category="${escape(skill.category)}" id="${escape(skill.id)}">
  <div><p class="skill-category">${escape(skill.category)}</p><h3>${escape(skill.title)}</h3></div>
  <div><p class="skill-purpose">${escape(skill.purpose)}</p><a class="skill-source" href="https://github.com/learnrudi/registry/blob/${catalog.revision}/catalog/skills/${skill.id}/SKILL.md" aria-label="View ${escape(skill.title)} on GitHub">View skill on GitHub <span aria-hidden="true">↗</span></a></div>
</article>`).join('\n');
    return `<form class="skills-controls" id="skills-controls" role="search" aria-label="Find a skill" hidden>
  <div><label for="skills-query">Search skills</label><input id="skills-query" type="search" placeholder="Try policy, video, or code review" autocomplete="off"></div>
  <div><label for="skills-category">Type of work</label><select id="skills-category"><option value="">All categories</option>${options}</select></div>
  <button class="skills-reset" type="reset">Clear filters</button>
</form>
<p class="skills-count" id="skills-count" role="status" aria-live="polite" aria-atomic="true">${catalog.skills.length} skills</p>
<p class="skills-empty" id="skills-empty" hidden>No skills match those filters. Try a different search or clear the filters.</p>
<div class="skills-list">${rows}</div>`;
}

// Only the marked catalog fragment is generated; the page shell remains editable.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const catalog = JSON.parse(readFileSync(new URL('../catalog/skills.json', import.meta.url), 'utf8'));
    const pageURL = new URL('../../public/skills/index.html', import.meta.url);
    const page = readFileSync(pageURL, 'utf8');
    const marker = /<!-- SKILLS_START -->[\s\S]*?<!-- SKILLS_END -->/g;
    if ([...page.matchAll(marker)].length !== 1) throw new Error('Expected one skills output region');
    const output = page.replace(marker, () => `<!-- SKILLS_START -->\n${renderCatalog(catalog)}\n<!-- SKILLS_END -->`);
    if (process.argv.includes('--check')) {
        if (page !== output) throw new Error('Skills output is stale. Run npm run skills:render.');
        console.log(`Skills catalog verified: ${catalog.skills.length} public skills.`);
    } else {
        writeFileSync(pageURL, output);
        console.log(`Rendered ${catalog.skills.length} public skills.`);
    }
}
