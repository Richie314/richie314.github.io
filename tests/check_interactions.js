// Exercise the emitted trophy handlers and the installed email-copy runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = process.argv[2] || '_site';
const html = fs.readFileSync(path.join(root, 'repositories/index.html'), 'utf8');
const cards = html.match(/<img\b[^>]*data-fallback=[^>]*>/g) || [];
assert.equal(cards.length, 6);
for (const card of cards) {
  const fallback = card.match(/data-fallback="([^"]*)"/)[1].replaceAll('&amp;', '&');
  const handler = card.match(/onerror="([^"]*)"/)[1];
  const image = { dataset: { fallback }, hidden: false, src: 'primary' };
  const onerror = new Function(handler);
  onerror.call(image);
  assert.equal(image.src, fallback);
  assert.equal(image.dataset.fallback, undefined);
  assert.equal(image.hidden, false);
  onerror.call(image);
  assert.equal(image.hidden, true); // No retry loop or hiding other theme cards.
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const listeners = {};
let clipboard;
let prevented = false;
const attributes = home.match(/class="[^"]*al-email-protect[^"]*"[^>]*data-eu="([^"]+)"[^>]*data-ed="([^"]+)"/);
assert.ok(attributes, 'Homepage email control missing');
const email = { getAttribute: (name) => ({ 'data-eu': attributes[1], 'data-ed': attributes[2] })[name] };
const event = { target: { closest: () => email }, preventDefault: () => { prevented = true; } };
const toast = { setAttribute() {}, classList: { add() {}, remove() {} } };
const document = {
  readyState: 'complete',
  addEventListener: (name, handler) => { listeners[name] = handler; },
  getElementById: (id) => id.startsWith('search-email-') ? { click: () => listeners.click(event) } : toast,
};
const sandbox = {
  document,
  window: { isSecureContext: true },
  navigator: { clipboard: { writeText: (value) => { clipboard = value; return Promise.resolve(); } } },
  setTimeout: () => 1,
  clearTimeout() {},
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/al_email_protect/js/email-protect.js'), 'utf8'), sandbox);
listeners.click(event);
assert.equal(clipboard, 'riccardo@ciucci.dev');
assert.equal(prevented, true);
clipboard = undefined;
listeners.keydown({ ...event, key: ' ' });
assert.equal(clipboard, 'riccardo@ciucci.dev');
clipboard = undefined;
const searchAction = home.match(/document\.getElementById\("search-email-\d+"\)\.click\(\)/);
assert.ok(searchAction, 'Search must use the protected email control');
vm.runInNewContext(searchAction[0], sandbox);
assert.equal(clipboard, 'riccardo@ciucci.dev');
console.log('Passed: trophy fallback/retry limits, email copy, keyboard activation, and search email action.');
