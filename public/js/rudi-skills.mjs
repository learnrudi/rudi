export function matchesSkill(skill, query, category) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const text = `${skill.id} ${skill.title} ${skill.category} ${skill.purpose}`.toLowerCase();
    return (!category || skill.category === category) && terms.every(term => text.includes(term));
}

export function initSkills(root) {
    const form = root.querySelector('#skills-controls');
    if (!form) return;
    const query = root.querySelector('#skills-query');
    const category = root.querySelector('#skills-category');
    const count = root.querySelector('#skills-count');
    const empty = root.querySelector('#skills-empty');
    const rows = [...root.querySelectorAll('[data-skill]')].map(row => ({ row, skill: {
        id: row.dataset.id, category: row.dataset.category,
        title: row.querySelector('h3').textContent,
        purpose: row.querySelector('.skill-purpose').textContent,
    } }));
    const update = () => {
        let visible = 0;
        for (const { row, skill } of rows) {
            row.hidden = !matchesSkill(skill, query.value, category.value);
            if (!row.hidden) visible++;
        }
        count.textContent = `${visible} of ${rows.length} skills`;
        empty.hidden = visible > 0;
    };
    query.addEventListener('input', update);
    category.addEventListener('change', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', () => {
        query.value = '';
        category.value = '';
        update();
        query.focus();
    });
    update();
    form.hidden = false;
}

if (typeof document !== 'undefined') initSkills(document);
