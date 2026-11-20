import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampScrubTime,
  computeCoverDrawRect,
  filterSkills,
  formatTopicPrompt,
  timeToFrameIndex,
  toggleSelection,
  validateContactForm,
} from './portfolio';
import { SKILLS_DATA } from '../data/portfolioData';

test('clampScrubTime advances proportionally and clamps within [0, duration]', () => {
  const duration = 10;
  const width = 1000;
  // deltaX = 500 -> +0.5 * 0.8 * 10 = +4s
  assert.equal(clampScrubTime(2, 500, width, duration), 6);
  // Clamps at upper bound
  assert.equal(clampScrubTime(8, 1000, width, duration), 10);
  // Clamps at lower bound
  assert.equal(clampScrubTime(1, -1000, width, duration), 0);
  // Handles zero or NaN duration safely
  assert.equal(clampScrubTime(1, 200, width, 0), 0);
  assert.equal(clampScrubTime(1, 200, width, Number.NaN), 0);
});

test('timeToFrameIndex maps timestamps cleanly across cached frames', () => {
  assert.equal(timeToFrameIndex(0, 4, 73), 0);
  assert.equal(timeToFrameIndex(2, 4, 73), 36);
  assert.equal(timeToFrameIndex(4, 4, 73), 72);
  assert.equal(timeToFrameIndex(10, 4, 73), 72);
  assert.equal(timeToFrameIndex(-1, 4, 73), 0);
});

test('computeCoverDrawRect aligns right-bottom cover geometry accurately', () => {
  // 16:9 source into 4:3 destination, right-bottom aligned (alignX=1, alignY=1)
  const rect = computeCoverDrawRect(1600, 900, 800, 600, 1, 1);
  // Scale = max(800/1600=0.5, 600/900=0.6667) -> height=600, width=1066.67, x=-266.67, y=0
  assert.ok(Math.abs(rect.height - 600) < 0.01);
  assert.ok(Math.abs(rect.width - (1600 * 600) / 900) < 0.01);
  assert.ok(Math.abs(rect.x + rect.width - 800) < 0.01);
  assert.equal(rect.y, 0);
});

test('toggleSelection adds and removes items cleanly without mutating original array', () => {
  const initial: string[] = ['AI / ML'];
  const added = toggleSelection(initial, 'Web Dev');
  assert.deepEqual(added, ['AI / ML', 'Web Dev']);
  assert.deepEqual(initial, ['AI / ML']);

  const removed = toggleSelection(added, 'AI / ML');
  assert.deepEqual(removed, ['Web Dev']);
});

test('filterSkills returns all or category-matched skills', () => {
  assert.equal(filterSkills(SKILLS_DATA, 'All').length, SKILLS_DATA.length);
  const webSkills = filterSkills(SKILLS_DATA, 'Web');
  assert.deepEqual(
    webSkills.map((s) => s.name),
    ['HTML', 'CSS', 'JavaScript']
  );
  const aiSkills = filterSkills(SKILLS_DATA, 'AI / ML');
  assert.ok(aiSkills.some((s) => s.name.includes('NumPy')));
});

test('formatTopicPrompt formats selected topics or returns empty string', () => {
  assert.equal(formatTopicPrompt([]), '');
  assert.equal(
    formatTopicPrompt(['AI / ML', 'Web Dev']),
    "Hi Shahbaj, I'd like to connect regarding: AI / ML, Web Dev."
  );
});

test('validateContactForm catches invalid fields and accepts valid input', () => {
  const invalid = validateContactForm({
    name: 'A',
    email: 'bad-email',
    message: 'Too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    message: 'Would love to collaborate on a Python data visualization project.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});
