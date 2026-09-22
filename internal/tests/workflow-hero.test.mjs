import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../../public/js/rudi-workflow-hero.js', import.meta.url), 'utf8');

function workflow({ reducedMotion = false } = {}) {
  function element() {
    return {
      dataset: {}, attrs: {}, events: {}, children: [], textContent: '', hidden: false,
      setAttribute(key, value) { this.attrs[key] = value; },
      getAttribute(key) { return this.attrs[key]; },
      addEventListener(name, handler) { this.events[name] = handler; },
      append(...children) { this.children.push(...children); },
      getTotalLength() { return 100; },
      getPointAtLength(length) { return { x: 0, y: length }; },
    };
  }
  const elements = new Map();
  const root = element();
  root.querySelector = (selector) => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  const nodes = ['worker', 'drive', 'gmail', 'sheets', 'draft', 'review', 'ready'].map(id => {
    const node = element();
    node.dataset.node = id;
    return node;
  });
  const paths = Array.from({ length: 8 }, element);
  root.querySelectorAll = (selector) => selector === '[data-node]' ? nodes : paths;
  const document = Object.assign(element(), {
    hidden: false, getElementById: () => root, createElementNS: element,
  });
  const preference = Object.assign(element(), { matches: reducedMotion });
  const frames = new Map();
  let time = 0;
  let nextId = 0;
  let onIntersection;
  vm.runInNewContext(source, {
    document, matchMedia: () => preference,
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame(id) { frames.delete(id); },
    IntersectionObserver: class {
      constructor(callback) { onIntersection = callback; }
      observe() { onIntersection([{ isIntersecting: true }]); }
    },
  });
  return {
    root, nodes, preference, frames,
    control: (name) => elements.get(`[data-control="${name}"]`),
    status: () => elements.get('[data-status]').textContent,
    advance(milliseconds) {
      for (let remaining = milliseconds; remaining > 0; remaining -= 100) {
        time += Math.min(remaining, 100);
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(callback => callback(time));
      }
    },
    visible(value) { onIntersection([{ isIntersecting: value }]); },
    hidden(value) { document.hidden = value; document.events.visibilitychange(); },
  };
}

test('the example reaches human review before sharing, and Pause freezes playback', () => {
  const demo = workflow();
  demo.advance(17000);
  assert.match(demo.status(), /your review/);
  assert.equal(demo.nodes.find(node => node.dataset.node === 'review').dataset.active, 'true');
  demo.control('play').events.click();
  const paused = demo.root.dataset.progress;
  demo.advance(30000);
  assert.equal(demo.root.dataset.progress, paused);
  assert.equal(demo.frames.size, 0, 'paused playback must release the animation frame');
  demo.control('play').events.click();
  demo.advance(3500);
  assert.match(demo.status(), /After approval/);
});

test('reduced motion starts with a still review stage and allows explicit playback', () => {
  const demo = workflow({ reducedMotion: true });
  assert.equal(demo.control('play').textContent, 'Play');
  assert.match(demo.status(), /your review/);
  assert.equal(demo.frames.size, 0);
  demo.control('replay').events.click();
  demo.advance(5000);
  assert.match(demo.status(), /connects/);
  demo.preference.events.change({ matches: true });
  assert.equal(demo.frames.size, 0, 'a new reduced-motion preference stops animation');
});

test('hidden and offscreen playback suspends without skipping ahead or overriding Pause', () => {
  const demo = workflow();
  demo.advance(5000);
  for (const suspend of [demo.visible.bind(null, false), demo.hidden.bind(null, true)]) {
    suspend();
    const progress = demo.root.dataset.progress;
    demo.advance(60000);
    assert.equal(demo.frames.size, 0);
    assert.equal(demo.root.dataset.progress, progress);
    demo.visible(true);
    demo.hidden(false);
    demo.advance(100);
    assert.equal(demo.root.dataset.progress, progress, 'resume must not count hidden time');
  }
  demo.control('play').events.click();
  demo.visible(false);
  demo.visible(true);
  assert.equal(demo.frames.size, 0, 'scrolling back must preserve an explicit pause');
});
