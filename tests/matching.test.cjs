const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Run the project's TypeScript with its existing compiler; no test dependency needed.
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8').replace(
    /(["'])@\/([^"']+)\1/g,
    (_, quote, target) => JSON.stringify(path.join(__dirname, '../src', target))
  );
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
};

const { calculateMatchScore, rankTutors } = require('../src/lib/matchingAlgorithm.ts');
const { INITIAL_TUTORS } = require('../src/data/mockData.ts');
const { readSearchFilter, searchFilterQuery } = require('../src/lib/searchFilters.ts');
const base = {
  subject: 'Microeconomics', topic: '', learningStyles: [], minBudget: 100,
  maxBudget: 200, days: [], timeslots: [], deliveryMode: 'All',
};
const maria = INITIAL_TUTORS.find(t => t.id === 'tutor-1');

test('an unrelated subject gets no match instead of a minimum score', () => {
  assert.equal(calculateMatchScore(maria, { ...base, subject: 'Organic Chemistry' }), 0);
});
test('subject searches accept course codes and titles without confusing code prefixes', () => {
  const math = INITIAL_TUTORS.find(t => t.id === 'tutor-3');
  assert.ok(calculateMatchScore(math, { ...base, subject: '  MATH21 ' }) > 0);
  assert.ok(calculateMatchScore(math, { ...base, subject: 'calculus I' }) > 0);
  assert.equal(calculateMatchScore(math, { ...base, subject: 'Math 2' }), 0);
});
test('budget is a ceiling and a cheaper tutor remains eligible', () => {
  assert.equal(calculateMatchScore(maria, { ...base, maxBudget: 140 }), 0);
  assert.ok(calculateMatchScore({ ...maria, hourlyRate: 90 }, base) > 0);
});
test('delivery, days and time must each have an available option', () => {
  assert.equal(calculateMatchScore({ ...maria, deliveryModes: ['Online'] }, { ...base, deliveryMode: 'VSU Campus' }), 0);
  assert.equal(calculateMatchScore(maria, { ...base, days: ['Tue', 'Thu'] }), 0);
  assert.equal(calculateMatchScore(maria, { ...base, timeslots: ['Morning (8:00 AM - 12:00 PM)'] }), 0);
  assert.ok(calculateMatchScore(maria, { ...base, days: ['Sat', 'Sun'], timeslots: ['Evening (5:00 PM - 8:00 PM)'] }) > 0);
});
test('custom tutor time ranges overlap the requested period without treating touching endpoints as available', () => {
  const custom = { ...maria, timeslots: ['4:00 PM – 7:00 PM'] };
  assert.ok(calculateMatchScore(custom, { ...base, timeslots: ['Afternoon (1:00 PM - 5:00 PM)'] }) > 0);
  assert.ok(calculateMatchScore(custom, { ...base, timeslots: ['Evening (5:00 PM - 8:00 PM)'] }) > 0);
  assert.equal(calculateMatchScore(custom, { ...base, timeslots: ['Morning (8:00 AM - 12:00 PM)'] }), 0);
  assert.equal(calculateMatchScore({ ...maria, timeslots: ['1:00 PM – 5:00 PM'] }, { ...base, timeslots: ['Evening (5:00 PM - 8:00 PM)'] }), 0);
});
test('topic and style preferences improve ordering without excluding suitable teachers', () => {
  const specialist = { ...maria, id: 'specialist', bio: 'Supply and demand, price elasticity.', learningStyles: ['Visual'] };
  const other = { ...maria, id: 'other', bio: 'Market structures and costs.', learningStyles: ['Discussion'] };
  const ranked = rankTutors([other, specialist], { ...base, topic: 'supply and demand', learningStyles: ['Visual'] });
  assert.deepEqual(ranked.map(t => t.id), ['specialist', 'other']);
  assert.ok(ranked[0].matchScore > ranked[1].matchScore);
});
test('ranking excludes unsuitable tutors and returns an empty list for an unknown subject', () => {
  const ranked = rankTutors(INITIAL_TUTORS, base);
  assert.ok(ranked.length > 1);
  assert.ok(ranked.every(t => t.hourlyRate <= 200 && t.subjectsMastered.includes('Microeconomics')));
  assert.deepEqual(rankTutors(INITIAL_TUTORS, { ...base, subject: 'Quantum Computing' }), []);
});
test('new demo tutors cover Agribusiness subjects with varied rates and availability', () => {
  assert.equal(INITIAL_TUTORS.length, 20);
  assert.equal(new Set(INITIAL_TUTORS.map(t => t.id)).size, 20);
  const ranked = rankTutors(INITIAL_TUTORS, { ...base, subject: 'Agricultural Economics', maxBudget: 300 });
  assert.ok(ranked.length >= 3);
  assert.ok(new Set(ranked.map(t => t.hourlyRate)).size > 1);
  assert.ok(rankTutors(INITIAL_TUTORS, { ...base, subject: 'Farm Management', days: ['Sat', 'Sun'], deliveryMode: 'Online' }).length > 0);
});

test('all search preferences survive a shared link or refresh, including cleared preferences', () => {
  const filter = { ...base, topic: 'supply & demand', learningStyles: ['Practice / Problem Solving'], days: ['Sat', 'Sun'], timeslots: ['Morning (8:00 AM - 12:00 PM)'], deliveryMode: 'Online', minBudget: 0, sortBy: 'match' };
  assert.deepEqual(readSearchFilter(new URLSearchParams(searchFilterQuery(filter))), filter);
  const cleared = readSearchFilter(new URLSearchParams('subject=Microeconomics&topic=&budget=200'), filter);
  assert.equal(cleared.topic, '');
  assert.deepEqual(cleared.days, []);
  assert.deepEqual(cleared.timeslots, []);
  assert.equal(cleared.deliveryMode, 'All');
});
test('invalid URL budgets use a usable default and course links still prefill a subject', () => {
  assert.equal(readSearchFilter(new URLSearchParams('course=Farm+Management')).subject, 'Farm Management');
  for (const budget of ['NaN', '-1', '999', '']) {
    assert.equal(readSearchFilter(new URLSearchParams(`subject=Microeconomics&budget=${budget}`)).maxBudget, 200);
  }
});
test('both delivery modes are required when requested; tied results use an affordable stable order', () => {
  assert.equal(calculateMatchScore({ ...maria, deliveryModes: ['Online'] }, { ...base, deliveryMode: 'Both' }), 0);
  const cheap = { ...maria, id: 'cheap', hourlyRate: 100 };
  const expensive = { ...maria, id: 'expensive', hourlyRate: 200 };
  assert.deepEqual(rankTutors([expensive, cheap], base).map(t => t.id), ['cheap', 'expensive']);
  assert.ok(rankTutors(INITIAL_TUTORS, base).every(t => t.matchScore >= 0 && t.matchScore <= 100));
});
