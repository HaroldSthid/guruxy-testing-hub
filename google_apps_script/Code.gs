const SHEET_NAME = 'submissions';
const MAX_ITEMS = 500;

function doGet() {
  try {
    const items = readSubmissions();
    return jsonResponse({ ok: true, items: items });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (!raw) {
      return jsonResponse({ ok: false, error: 'empty_body' });
    }

    const payload = JSON.parse(raw);
    const normalized = normalizeSubmission(payload);
    appendSubmission(normalized);

    return jsonResponse({ ok: true, id: normalized.id });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function normalizeSubmission(payload) {
  const nowIso = new Date().toISOString();
  const submission = payload || {};

  return {
    id: submission.id || Utilities.getUuid(),
    form: submission.form || '',
    testerName: submission.testerName || 'Tester',
    testerEmail: submission.testerEmail || '',
    submittedAt: submission.submittedAt || nowIso,
    susScore: typeof submission.susScore === 'number' ? submission.susScore : null,
    bugSeverity: submission.bugSeverity || '',
    bugActual: submission.bugActual || '',
    answers: submission.answers || {}
  };
}

function appendSubmission(submission) {
  const sheet = ensureSheet();
  sheet.appendRow([
    submission.id,
    submission.submittedAt,
    submission.form,
    submission.testerName,
    submission.testerEmail,
    submission.susScore,
    submission.bugSeverity,
    submission.bugActual,
    JSON.stringify(submission.answers)
  ]);
}

function readSubmissions() {
  const sheet = ensureSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const range = sheet.getRange(2, 1, lastRow - 1, 9);
  const rows = range.getValues();

  const records = rows
    .map(function(row) {
      let parsedAnswers = {};
      try {
        parsedAnswers = row[8] ? JSON.parse(row[8]) : {};
      } catch (e) {
        parsedAnswers = {};
      }

      const sus = row[5] === '' || row[5] === null ? null : Number(row[5]);
      return {
        id: String(row[0] || ''),
        submittedAt: String(row[1] || ''),
        form: String(row[2] || ''),
        testerName: String(row[3] || 'Tester'),
        testerEmail: String(row[4] || ''),
        susScore: isNaN(sus) ? null : sus,
        bugSeverity: String(row[6] || ''),
        bugActual: String(row[7] || ''),
        answers: parsedAnswers
      };
    })
    .filter(function(item) {
      return !!item.id;
    });

  return records.slice(Math.max(0, records.length - MAX_ITEMS));
}

function ensureSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id',
      'submittedAt',
      'form',
      'testerName',
      'testerEmail',
      'susScore',
      'bugSeverity',
      'bugActual',
      'answersJson'
    ]);
  }

  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
