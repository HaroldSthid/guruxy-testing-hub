import assert from 'node:assert/strict';

function normalizeMediaItems(urlOrEncodedItems, type, hint) {
  const normalizeItem = (item, fallbackType = 'image', fallbackHint = 'Referencia visual') => {
    if (!item) return null;
    if (typeof item === 'string') {
      const url = item.trim();
      return url ? { url, type: fallbackType, hint: fallbackHint } : null;
    }
    if (typeof item === 'object' && item.url) {
      return {
        url: item.url,
        type: item.type || fallbackType,
        hint: item.hint || fallbackHint
      };
    }
    return null;
  };

  if (typeof urlOrEncodedItems === 'string' && typeof type === 'undefined' && typeof hint === 'undefined') {
    try {
      const parsed = JSON.parse(decodeURIComponent(urlOrEncodedItems));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => normalizeItem(item)).filter(Boolean);
      }
    } catch (_err) {
      // Fallback to single URL flow.
    }
  }

  if (Array.isArray(urlOrEncodedItems)) {
    return urlOrEncodedItems.map(item => normalizeItem(item)).filter(Boolean);
  }

  if (typeof urlOrEncodedItems === 'string' && urlOrEncodedItems.trim()) {
    const item = normalizeItem(urlOrEncodedItems, type || 'image', hint || 'Referencia visual');
    return item ? [item] : [];
  }

  return [];
}

function resolveQuestionReferenceMedia(question) {
  const legacyItems = Array.isArray(question.mediaItems)
    ? normalizeMediaItems(question.mediaItems)
    : Array.isArray(question.mediaUrls)
      ? question.mediaUrls.map((url, idx) => ({
        url,
        type: question.mediaType || 'image',
        hint: Array.isArray(question.mediaHints) && question.mediaHints[idx]
          ? question.mediaHints[idx]
          : (question.mediaHint || 'Referencia visual')
      }))
      : question.mediaUrl
        ? [{ url: question.mediaUrl, type: question.mediaType || 'image', hint: question.mediaHint || 'Referencia visual' }]
        : [];

  const reference = question && typeof question === 'object' ? question.reference : null;
  if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
    return { enabled: legacyItems.length > 0, label: '', items: legacyItems };
  }

  if (reference.enabled === false) {
    return { enabled: false, label: '', items: [] };
  }

  const referenceItems = Array.isArray(reference.items)
    ? normalizeMediaItems(reference.items)
    : typeof reference.items === 'string' && reference.items.trim()
      ? normalizeMediaItems(reference.items)
      : [];

  return {
    enabled: true,
    label: typeof reference.label === 'string' && reference.label.trim() ? reference.label.trim() : '',
    items: referenceItems.length ? referenceItems : legacyItems
  };
}

function parseResponseJsonText(text) {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.parse(trimmed);
  } catch (_err) {
    return null;
  }
}

function classifyGoogleAppsScriptSubmitResponse(respOk, text) {
  const payload = parseResponseJsonText(text);
  if (payload && payload.ok === false) return 'app_error';
  if (!respOk) return 'transport_error';
  return 'success';
}

function buildGoogleAppsScriptReadEndpoint(endpoint, readAdminToken) {
  if (!endpoint) return '';
  if (!readAdminToken) return endpoint;
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}token=${encodeURIComponent(readAdminToken)}`;
}

function resolveActiveFormVersion(formKey, catalog) {
  const entry = catalog && catalog.forms ? catalog.forms[formKey] : null;
  if (!entry || typeof entry !== 'object') return null;
  const versions = entry.versions && typeof entry.versions === 'object' ? entry.versions : null;
  if (!versions) return null;
  const versionId = typeof entry.activeVersion === 'string' ? entry.activeVersion : '';
  const version = versionId && versions[versionId] ? versions[versionId] : Object.values(versions)[0];
  if (!version || typeof version !== 'object') return null;
  const form = version.form || null;
  return {
    formKey,
    activeVersion: versionId || version.id || '',
    version: {
      id: version.id || '',
      label: version.label || '',
      status: version.status || ''
    },
    form: form ? {
      ...form,
      formKey,
      activeVersion: versionId || version.id || '',
      version: {
        id: version.id || '',
        label: version.label || '',
        status: version.status || ''
      }
    } : null
  };
}

function isAnsweredValue(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

function buildFormSnapshot(formData, answers) {
  const snapshot = {
    formKey: formData.formKey || '',
    formId: formData.id || '',
    formVersion: formData.activeVersion || formData.version?.id || '',
    versionLabel: formData.version?.label || '',
    versionStatus: formData.version?.status || '',
    title: formData.title || '',
    duration: formData.duration || '',
    target: formData.target || '',
    sections: []
  };

  (Array.isArray(formData.sections) ? formData.sections : []).forEach(section => {
    const sectionSnapshot = { title: section.title || '', instruction: section.instruction || '', questions: [] };
    (Array.isArray(section.questions) ? section.questions : []).forEach(question => {
      const key = `q_${String(question.id || '').replace(/[^a-zA-Z0-9_]/g, '_')}`;
      if (!isAnsweredValue(answers[key])) return;
      const reference = resolveQuestionReferenceMedia(question);
      sectionSnapshot.questions.push({
        id: question.id || '',
        text: question.text || '',
        type: question.type || '',
        options: Array.isArray(question.options) ? [...question.options] : [],
        reference
      });
    });
    if (sectionSnapshot.questions.length) snapshot.sections.push(sectionSnapshot);
  });

  return snapshot;
}

function normalizeSubmissionTag(value, fallback) {
  const clean = String(value || '').replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  return clean || fallback;
}

function parseMaybeJson(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.parse(trimmed);
  } catch (_err) {
    return null;
  }
}

function getSubmissionAnswers(submission) {
  if (submission && submission.answers && typeof submission.answers === 'object' && !Array.isArray(submission.answers)) {
    return submission.answers;
  }
  const parsed = parseMaybeJson(submission && submission.answersJson);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function getSubmissionMeta(submission) {
  const meta = getSubmissionAnswers(submission).__meta;
  return meta && typeof meta === 'object' && !Array.isArray(meta) ? meta : {};
}

function getSubmissionTestRun(submission) {
  const meta = getSubmissionMeta(submission);
  return normalizeSubmissionTag(meta.testRun || submission?.testRun || '', 'legacy');
}

function getSubmissionCohort(submission) {
  const meta = getSubmissionMeta(submission);
  return normalizeSubmissionTag(meta.cohort || submission?.cohort || '', 'unassigned');
}

function buildSubmissionMeta(formVersion, formSnapshot, submittedAt, testRun, cohort) {
  return {
    testRun: normalizeSubmissionTag(testRun, 'legacy'),
    cohort: normalizeSubmissionTag(cohort, 'unassigned'),
    submittedAt: submittedAt || new Date().toISOString(),
    formVersion,
    formSnapshot
  };
}

function isPlaceholderReadAdminToken(token) {
  const normalized = String(token || '').trim();
  return !normalized || normalized === 'CHANGE_ME_READ_ADMIN_TOKEN' || normalized === 'PASTE_READ_ADMIN_TOKEN_HERE';
}

function resolveReadAdminToken(search, configuredToken = '') {
  const params = new URLSearchParams(String(search || '').startsWith('?') ? String(search || '') : `?${String(search || '')}`);
  const mode = String(params.get('mode') || '').toLowerCase();
  const hasTokenParam = params.has('readToken') || params.has('adminToken') || params.has('token');
  const urlToken = hasTokenParam && (mode === 'admin' || hasTokenParam)
    ? String(params.get('readToken') || params.get('adminToken') || params.get('token') || '').trim()
    : '';

  if (!isPlaceholderReadAdminToken(urlToken)) return urlToken;

  const configured = String(configuredToken || '').trim();
  if (!isPlaceholderReadAdminToken(configured)) return configured;

  if (mode !== 'admin' && !hasTokenParam) return '';
  return '';
}

function buildShareUrlForCurrentForm(currentUrl, selectedForm) {
  const url = new URL(currentUrl);
  url.searchParams.set('tab', 'forms');
  url.searchParams.set('form', selectedForm);
  url.searchParams.set('mode', 'public');
  url.searchParams.delete('token');
  url.searchParams.delete('adminToken');
  url.searchParams.delete('readToken');
  return url.toString();
}

function resolveUrlStateFromSearch(search) {
  const params = new URLSearchParams(String(search || '').startsWith('?') ? String(search || '') : `?${String(search || '')}`);
  const tab = params.get('tab');
  const form = params.get('form');
  const mode = String(params.get('mode') || '').toLowerCase();
  const validTabs = ['strategy', 'forms', 'testers', 'sus', 'bugs'];
  const validForms = ['A', 'B', 'C'];
  const nextState = {};

  if (tab && validTabs.includes(tab)) nextState.activeTab = tab;
  if (form && validForms.includes(form)) nextState.selectedForm = form;

  if (mode === 'tester') {
    nextState.uiMode = 'tester';
    nextState.activeTab = 'forms';
    if (form && validForms.includes(form)) nextState.lockedForm = form;
    return nextState;
  }

  if (mode === 'public') {
    nextState.uiMode = 'public';
    nextState.activeTab = 'forms';
    if (form && validForms.includes(form)) nextState.lockedForm = form;
    return nextState;
  }

  if (mode === 'admin') {
    nextState.uiMode = 'full';
    nextState.activeTab = tab && validTabs.includes(tab) ? tab : 'testers';
    nextState.lockedForm = null;
  }

  return nextState;
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function renderTestRunOption(run, selectedRun) {
  return `<option value="${escapeAttr(run)}"${selectedRun === run ? ' selected' : ''}>${escapeHtml(run)}</option>`;
}

function renderGroupedTestRunSummary(responses, selectedRun = 'all') {
  const filteredResponses = selectedRun === 'all'
    ? responses
    : responses.filter(submission => submission.testRun === selectedRun);

  const runStats = new Map();
  filteredResponses.forEach(submission => {
    const run = submission.testRun || 'legacy';
    const cohort = submission.cohort || 'unassigned';
    const current = runStats.get(run) || { count: 0, latestAt: '', cohorts: new Set() };
    current.count += 1;
    current.cohorts.add(cohort);
    if (!current.latestAt || new Date(submission.submittedAt || 0) > new Date(current.latestAt || 0)) {
      current.latestAt = submission.submittedAt || '';
    }
    runStats.set(run, current);
  });

  const optionsHtml = [...new Set(['legacy', ...responses.map(submission => submission.testRun || 'legacy')])]
    .map(run => renderTestRunOption(run, selectedRun))
    .join('');

  const cardsHtml = [...runStats.entries()].map(([run, stats]) => `
    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div class="flex items-center justify-between gap-2">
        <span class="text-sm font-extrabold text-slate-800">${escapeHtml(run)}</span>
        <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">${stats.count}</span>
      </div>
      <p class="text-[11px] text-slate-500 mt-1">Cohorts: ${escapeHtml([...stats.cohorts].join(', '))}</p>
    </div>
  `).join('');

  return { optionsHtml, cardsHtml };
}

assert.deepEqual(
  resolveQuestionReferenceMedia({
    mediaUrl: 'https://example.test/legacy.jpg',
    mediaType: 'image',
    mediaHint: 'Legacy hint',
    reference: { enabled: false, items: [{ url: 'https://example.test/override.jpg' }] }
  }),
  { enabled: false, label: '', items: [] }
);

const versionedCatalog = {
  forms: {
    A: {
      activeVersion: 'v1',
      versions: {
        v1: {
          id: 'v1',
          label: 'Initial extracted version',
          status: 'active',
          form: {
            id: 'form-a',
            title: 'Formulario A - Home Guruxy',
            duration: '12 a 18 minutos',
            target: 'Cualquier tester (incluso sin conocimiento previo)',
            sections: [{
              title: 'Sección A1 - Primera Impresión',
              questions: [
                { id: 'A1.1', text: 'Mira el Home durante 10 segundos. ¿Qué crees que hace Guruxy?', type: 'Paragraph', options: [], mediaUrl: 'https://example.test/legacy.jpg', mediaHint: 'Home reference' },
                { id: 'A4.5', text: 'Sube evidencia si aplica: screenshot o video', type: 'File Upload', options: [] }
              ]
            }]
          }
        }
      }
    }
  }
};

assert.equal(resolveActiveFormVersion('A', versionedCatalog).version.id, 'v1');

const snapshot = buildFormSnapshot(resolveActiveFormVersion('A', versionedCatalog).form, {
  q_A1_1: 'Observed',
  q_A4_5: [{ filename: 'evidence.png', mimeType: 'image/png', base64: 'data:image/png;base64,AAAA' }]
});

assert.equal(snapshot.formVersion, 'v1');
assert.equal(snapshot.sections[0].questions.length, 2);
assert.equal(snapshot.sections[0].questions[0].type, 'Paragraph');
assert.equal(snapshot.sections[0].questions[0].reference.items.length, 1);
assert.equal(snapshot.sections[0].questions[1].type, 'File Upload');

const submissionMeta = buildSubmissionMeta('v1', snapshot, '2026-07-07T18:00:00.000Z', 'internal-smoke', 'internal-smoke-cohort');
assert.equal(submissionMeta.testRun, 'internal-smoke');
assert.equal(submissionMeta.cohort, 'internal-smoke-cohort');
assert.equal(submissionMeta.submittedAt, '2026-07-07T18:00:00.000Z');
assert.equal(submissionMeta.formVersion, 'v1');
assert.deepEqual(submissionMeta.formSnapshot, snapshot);

const legacyAnswers = JSON.parse('{"q_A0_1":"Tester","q_A4_5":[{"filename":"evidence.png","mimeType":"image/png","base64":"data:image/png;base64,AAAA"}]}');
assert.equal(isAnsweredValue(legacyAnswers.q_A0_1), true);
assert.equal(isAnsweredValue(legacyAnswers.q_A4_5), true);
assert.equal(legacyAnswers.q_missing, undefined);
assert.equal(getSubmissionTestRun({ answers: { __meta: { testRun: 'public-beta' } } }), 'public-beta');
assert.equal(getSubmissionTestRun({ answers: { __meta: { formVersion: 'v1' } } }), 'legacy');
assert.equal(getSubmissionTestRun({ answersJson: '{"__meta":{"testRun":"campaign-42"}}' }), 'campaign-42');
assert.equal(getSubmissionCohort({ answers: { __meta: {} } }), 'unassigned');

assert.deepEqual(
  resolveQuestionReferenceMedia({
    mediaUrl: 'https://example.test/legacy.jpg',
    mediaType: 'image',
    mediaHint: 'Legacy hint',
    reference: { enabled: true, label: 'Ver ayuda', items: [{ url: 'https://example.test/override.jpg', type: 'image', hint: 'Override' }] }
  }),
  {
    enabled: true,
    label: 'Ver ayuda',
    items: [{ url: 'https://example.test/override.jpg', type: 'image', hint: 'Override' }]
  }
);

assert.deepEqual(
  resolveQuestionReferenceMedia({
    mediaUrls: ['https://example.test/a.jpg', 'https://example.test/b.jpg'],
    mediaType: 'image',
    mediaHint: 'Legacy gallery'
  }),
  {
    enabled: true,
    label: '',
    items: [
      { url: 'https://example.test/a.jpg', type: 'image', hint: 'Legacy gallery' },
      { url: 'https://example.test/b.jpg', type: 'image', hint: 'Legacy gallery' }
    ]
  }
);

assert.deepEqual(parseResponseJsonText('  {"ok":false,"error":"submit_failed"}  '), {
  ok: false,
  error: 'submit_failed'
});

assert.equal(
  classifyGoogleAppsScriptSubmitResponse(true, '{"ok":false,"error":"submit_failed"}'),
  'app_error'
);

assert.equal(
  classifyGoogleAppsScriptSubmitResponse(false, 'not json'),
  'transport_error'
);

assert.equal(
  buildGoogleAppsScriptReadEndpoint('https://script.google.com/macros/s/example/exec', 'READ TOKEN'),
  'https://script.google.com/macros/s/example/exec?token=READ%20TOKEN'
);

assert.equal(
  buildGoogleAppsScriptReadEndpoint('https://script.google.com/macros/s/example/exec?foo=bar', 'READ TOKEN'),
  'https://script.google.com/macros/s/example/exec?foo=bar&token=READ%20TOKEN'
);

assert.equal(
  buildGoogleAppsScriptReadEndpoint('https://script.google.com/macros/s/example/exec', ''),
  'https://script.google.com/macros/s/example/exec'
);

assert.equal(
  resolveReadAdminToken('?mode=admin&readToken=READ TOKEN', ''),
  'READ TOKEN'
);

assert.equal(
  resolveReadAdminToken('?adminToken=READ TOKEN', ''),
  'READ TOKEN'
);

assert.equal(
  resolveReadAdminToken('?mode=admin&readToken=PASTE_READ_ADMIN_TOKEN_HERE', ''),
  ''
);

assert.equal(
  resolveReadAdminToken('?mode=public', 'CONFIG TOKEN'),
  'CONFIG TOKEN'
);

assert.deepEqual(
  resolveUrlStateFromSearch('?mode=admin&readToken=READ'),
  { uiMode: 'full', activeTab: 'testers', lockedForm: null }
);

assert.deepEqual(
  resolveUrlStateFromSearch('?mode=admin&tab=sus&form=B'),
  { activeTab: 'sus', selectedForm: 'B', uiMode: 'full', lockedForm: null }
);

assert.deepEqual(
  resolveUrlStateFromSearch('?mode=public&form=C&tab=testers'),
  { activeTab: 'forms', selectedForm: 'C', uiMode: 'public', lockedForm: 'C' }
);

assert.deepEqual(
  resolveUrlStateFromSearch('?mode=tester&form=A&tab=bugs'),
  { activeTab: 'forms', selectedForm: 'A', uiMode: 'tester', lockedForm: 'A' }
);

const shareUrl = buildShareUrlForCurrentForm('https://example.test/?mode=admin&readToken=READ&tab=sus', 'B');
assert.equal(shareUrl.includes('readToken='), false);
assert.equal(shareUrl.includes('adminToken='), false);
assert.equal(shareUrl.includes('token='), false);
assert.equal(shareUrl.includes('mode=public'), true);
assert.equal(shareUrl.includes('tab=forms'), true);
assert.equal(shareUrl.includes('form=B'), true);

assert.equal(parseResponseJsonText('ok:false'), null);
assert.equal(parseResponseJsonText(''), null);

const hostileRun = 'beta" onclick="alert(1)';
const hostileCohort = 'cohort<svg onload=1>';
const renderedSummary = renderGroupedTestRunSummary([
  { testRun: hostileRun, cohort: hostileCohort, submittedAt: '2026-07-07T18:00:00.000Z' },
  { testRun: 'beta-public-2026-07', cohort: 'beta-public-2026-07', submittedAt: '2026-07-07T18:30:00.000Z' }
], hostileRun);

assert.equal(renderTestRunOption('beta-public-2026-07', 'beta-public-2026-07'), '<option value="beta-public-2026-07" selected>beta-public-2026-07</option>');
assert.equal(renderedSummary.optionsHtml.includes('value="beta&quot; onclick=&quot;alert(1)" selected'), true);
assert.equal(renderedSummary.optionsHtml.includes('>beta&quot; onclick=&quot;alert(1)</option>'), true);
assert.equal(renderedSummary.cardsHtml.includes('Cohorts: cohort&lt;svg onload=1&gt;'), true);
assert.equal(renderedSummary.optionsHtml.includes('value="beta-public-2026-07">beta-public-2026-07</option>'), true);

console.log('Frontend contract checks passed.');
