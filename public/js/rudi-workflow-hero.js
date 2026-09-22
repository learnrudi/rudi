(() => {
  const root = document.getElementById('rudi-workflow-hero');
  if (!root) return;

  const play = root.querySelector('[data-control="play"]');
  const replay = root.querySelector('[data-control="replay"]');
  const status = root.querySelector('[data-status]');
  const stageLabel = root.querySelector('[data-stage]');
  const announcement = root.querySelector('[data-announcement]');
  const motion = root.querySelector('[data-layer="motion"]');
  const nodes = [...root.querySelectorAll('[data-node]')];
  const duration = 22000;
  // This is a looping illustration, not the status of a running worker.
  const stages = [
    { start: 0, end: .13, text: 'The digital worker plans the briefing.', active: ['worker'], edges: [] },
    { start: .13, end: .30, text: 'It connects to the tools your team uses.', active: [], edges: [0, 1, 2] },
    { start: .30, end: .46, text: 'Files, messages and data supply the context.', active: ['drive', 'gmail', 'sheets'], edges: [] },
    { start: .46, end: .64, text: 'The findings become a draft in Google Docs.', active: ['draft'], edges: [3, 4, 5] },
    { start: .64, end: .88, text: 'The draft pauses for your review.', active: ['review'], edges: [6], travel: .27 },
    { start: .88, end: 1, text: 'After approval, the briefing is shared in Slack.', active: ['ready'], edges: [7], travel: .6 },
  ];

  function create(tag, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  }

  const tracks = [...root.querySelectorAll('[data-layer="lines"] > path')].map(path => {
    const trace = create('path', { d: path.getAttribute('d'), class: 'rw-trace', opacity: '0' });
    const dot = create('circle', { r: '4', class: 'rw-dot', opacity: '0' });
    motion.append(trace, dot);
    return { path, trace, dot, length: path.getTotalLength() };
  });

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !preference.matches;
  let elapsed = preference.matches ? duration * .78 : 0;
  let previousTime = null;
  let frame = null;
  let stageIndex = -1;
  let visible = typeof IntersectionObserver !== 'function';

  function paint() {
    const progress = (elapsed % duration) / duration;
    const current = stages.findIndex(stage => progress < stage.end);
    const stage = stages[current];
    const local = (progress - stage.start) / (stage.end - stage.start);
    if (current !== stageIndex) {
      stageIndex = current;
      status.textContent = stage.text;
      stageLabel.textContent = `0${current + 1} / 06`;
      for (const node of nodes) node.dataset.active = String(stage.active.includes(node.dataset.node));
    }
    const travel = Math.min(1, local / (stage.travel ?? 1));
    tracks.forEach((track, index) => {
      const visible = stage.edges.includes(index) && travel < 1;
      track.dot.setAttribute('opacity', visible ? '1' : '0');
      track.trace.setAttribute('opacity', visible ? '.65' : '0');
      if (!visible) return;
      const distance = track.length * travel;
      const point = track.path.getPointAtLength(distance);
      const tail = Math.min(24, distance);
      track.dot.setAttribute('cx', String(point.x));
      track.dot.setAttribute('cy', String(point.y));
      track.trace.setAttribute('stroke-dasharray', `${tail} ${track.length + 24}`);
      track.trace.setAttribute('stroke-dashoffset', String(-(distance - tail)));
    });
    root.dataset.progress = progress.toFixed(3);
  }

  function tick(timestamp) {
    frame = null;
    if (previousTime !== null) elapsed += Math.min(timestamp - previousTime, 100);
    previousTime = timestamp;
    paint();
    schedule();
  }

  function schedule() {
    if (frame !== null) cancelAnimationFrame(frame);
    const running = playing && visible && !document.hidden;
    frame = running ? requestAnimationFrame(tick) : null;
    if (!running) previousTime = null;
  }

  function updateControls() {
    play.textContent = playing ? 'Pause' : 'Play';
    play.setAttribute('aria-label', playing ? 'Pause workflow animation' : 'Play workflow animation');
    root.dataset.playing = String(playing);
    schedule();
  }

  play.addEventListener('click', () => {
    playing = !playing;
    updateControls();
    announcement.textContent = playing ? 'Workflow animation playing.' : 'Workflow animation paused.';
  });
  replay.addEventListener('click', () => {
    elapsed = 0;
    previousTime = null;
    playing = true;
    paint();
    updateControls();
    announcement.textContent = 'Workflow animation restarted.';
  });
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    playing = false;
    updateControls();
  });
  document.addEventListener('visibilitychange', schedule);
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }).observe(root);
  }

  paint();
  root.querySelector('.rw-controls').hidden = false;
  updateControls();
})();
