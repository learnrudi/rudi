import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../../public/js/rudi-learn.js', import.meta.url), 'utf8');

function library(hash = '', mobile = false) {
  const nodes = new Map();
  const document = { activeElement: null };
  function element() {
    return {
      children: [], attrs: {}, events: {}, dataset: {}, src: '', scrolls: [],
      setAttribute(key, value) { this.attrs[key] = value; },
      append(...items) { this.children.push(...items); },
      replaceChildren(...items) { this.children = items; },
      addEventListener(event, handler) { this.events[event] = handler; },
      focus() { document.activeElement = this; },
      scrollIntoView(options) { this.scrolls.push(options); },
    };
  }
  const tabs = ['foundations', 'prompting', 'agents'].map((course) => {
    const tab = element();
    tab.dataset.course = course;
    tab.id = course;
    return tab;
  });
  document.querySelector = (selector) => {
    if (!nodes.has(selector)) nodes.set(selector, element());
    return nodes.get(selector);
  };
  document.querySelectorAll = () => tabs;
  document.createElement = element;
  const window = {
    location: { hash }, events: {},
    history: { replaceState(_state, _title, value) { window.location.hash = value; } },
    addEventListener(event, handler) { this.events[event] = handler; },
    matchMedia(query) { return { matches: query.includes('720px') && mobile }; },
  };
  vm.runInNewContext(source, { document, window });
  return { nodes, tabs, document, window };
}

test('unknown and inherited course fragments fall back to the first lesson', () => {
  for (const hash of ['#toString', '#constructor', '#__proto__', '#missing/lesson', '#agents/missing']) {
    const { nodes } = library(hash);
    assert.match(nodes.get('#lesson-player').src, hash.startsWith('#agents') ? /FJaD3x8Mx8E/ : /27RjvlXmkRw/);
  }
});

test('choosing a lesson keeps keyboard focus and brings the mobile player into view', () => {
  const { nodes, document, window } = library('', true);
  const list = nodes.get('#lesson-list');
  const button = list.children[1];
  button.focus();
  button.events.click();
  assert.equal(list.children[1], button, 'selection must not replace the focused lesson control');
  assert.equal(document.activeElement, button);
  assert.equal(button.attrs['aria-current'], 'true');
  assert.match(nodes.get('#lesson-player').src, /Tk-SxtaeSbA/);
  assert.equal(window.location.hash, '#foundations/human-to-ai');
  assert.equal(nodes.get('.learn-viewer').scrolls.length, 1);
});

test('keyboard course selection and next/previous controls follow the lesson order', () => {
  const { tabs, nodes, document } = library();
  tabs[0].events.keydown({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(document.activeElement, tabs[1]);
  assert.equal(tabs[1].attrs['aria-selected'], 'true');
  assert.equal(tabs[1].tabIndex, 0);
  assert.equal(tabs[0].tabIndex, -1);
  assert.equal(nodes.get('#lesson-previous').disabled, true);
  nodes.get('#lesson-next').events.click();
  assert.match(nodes.get('#lesson-player').src, /tktszPnaiRc/);
  assert.equal(nodes.get('#lesson-previous').disabled, false);
  nodes.get('#lesson-previous').events.click();
  assert.match(nodes.get('#lesson-player').src, /x7kq6udvgb8/);
  nodes.get('#lesson-list').children[7].events.click();
  assert.equal(nodes.get('#lesson-next').disabled, true);
  tabs[1].events.keydown({ key: 'End', preventDefault() {} });
  assert.equal(document.activeElement, tabs[2]);
  assert.equal(nodes.get('#course-panel').attrs['aria-labelledby'], 'agents');
});
