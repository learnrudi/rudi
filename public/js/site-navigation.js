// Native details provide the no-JavaScript path. This adds dismissal and context.
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.rudi-header');
    if (!header) return;
    const groups = [...header.querySelectorAll('.rudi-group')];
    const mobile = header.querySelector('.rudi-mobile');
    const closeGroups = (except) => {
        groups.forEach(group => { if (group !== except) group.open = false; });
    };
    groups.forEach(group => {
        group.addEventListener('toggle', () => { if (group.open) closeGroups(group); });
    });
    header.querySelectorAll('a').forEach(link => {
        const url = new URL(link.href, window.location.href);
        if (url.pathname === window.location.pathname && !url.hash) {
            link.setAttribute('aria-current', 'page');
            const group = link.closest('.rudi-group');
            if (group) group.dataset.current = 'true';
        }
        link.addEventListener('click', () => {
            closeGroups();
            if (mobile) mobile.open = false;
        });
    });
    document.addEventListener('click', event => {
        if (!header.contains(event.target)) {
            closeGroups();
            if (mobile) mobile.open = false;
        }
    });
    header.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const openGroup = event.target.closest('.rudi-group[open]');
        if (openGroup) {
            openGroup.open = false;
            openGroup.querySelector('summary').focus();
        } else if (mobile?.open) {
            mobile.open = false;
            mobile.querySelector('summary').focus();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000 && mobile?.open) {
            mobile.open = false;
            closeGroups();
        }
    });
});
