document.addEventListener('DOMContentLoaded', () => {
    const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;
    document.querySelectorAll('[data-video-trigger]').forEach((trigger) => {
        if (!(trigger instanceof HTMLButtonElement)) return;

        trigger.addEventListener('click', () => {
            const videoId = trigger.dataset.videoId || '';
            if (!videoIdPattern.test(videoId)) {
                trigger.disabled = true;
                trigger.setAttribute('aria-label', 'Video unavailable');
                return;
            }

            const media = trigger.closest('.video-testimonial-media');
            if (!media) return;

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.title = trigger.dataset.videoTitle || 'Video testimonial';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';

            media.replaceChildren(iframe);
            iframe.focus();
        });
    });
});

import('/js/visitor-prompt.mjs')
    .then(({ initVisitorPrompt }) => initVisitorPrompt())
    .catch((error) => console.warn('RUDI visitor prompt could not initialize.', error));
