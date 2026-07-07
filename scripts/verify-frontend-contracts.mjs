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

const legacyAnswers = JSON.parse('{"q_A0_1":"Tester","q_A4_5":[{"filename":"evidence.png","mimeType":"image/png","base64":"data:image/png;base64,AAAA"}]}');
assert.equal(isAnsweredValue(legacyAnswers.q_A0_1), true);
assert.equal(isAnsweredValue(legacyAnswers.q_A4_5), true);
assert.equal(legacyAnswers.q_missing, undefined);

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

const shareUrl = buildShareUrlForCurrentForm('https://example.test/?mode=admin&readToken=READ&tab=sus', 'B');
assert.equal(shareUrl.includes('readToken='), false);
assert.equal(shareUrl.includes('adminToken='), false);
assert.equal(shareUrl.includes('token='), false);
assert.equal(shareUrl.includes('mode=public'), true);
assert.equal(shareUrl.includes('tab=forms'), true);
assert.equal(shareUrl.includes('form=B'), true);

assert.equal(parseResponseJsonText('ok:false'), null);
assert.equal(parseResponseJsonText(''), null);

console.log('Frontend contract checks passed.');
