const SHEET_NAME = 'submissions';
const MAX_ITEMS = 500;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];

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

    if (submissionExists(normalized.id)) {
      return jsonResponse({ ok: true, id: normalized.id, duplicate: true });
    }

    // Process files if present (uploads to Drive and replaces with URL)
    processUploadedFiles(normalized);

    appendSubmission(normalized);

    return jsonResponse({ ok: true, id: normalized.id });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function processUploadedFiles(payload) {
  if (!payload || !payload.answers) return;
  
  for (const key in payload.answers) {
    const val = payload.answers[key];
    if (Array.isArray(val) && val.length > 0 && val.every(isUploadDescriptor)) {
      try {
        payload.answers[key] = val.map(uploadFileToDrive);
      } catch (err) {
        payload.answers[key] = "Error uploading files: " + String(err);
      }
      continue;
    }

    if (isUploadDescriptor(val)) {
      try {
        payload.answers[key] = uploadFileToDrive(val);
      } catch (err) {
        payload.answers[key] = "Error uploading file: " + String(err);
      }
    }
  }
}

function isUploadDescriptor(val) {
  return !!(val && typeof val === 'object' && val.base64 && val.filename);
}

function uploadFileToDrive(fileDescriptor) {
  let base64Data = String(fileDescriptor.base64 || '');
  const commaIdx = base64Data.indexOf(',');
  if (commaIdx !== -1) {
    base64Data = base64Data.substring(commaIdx + 1);
  }

  const estimatedBytes = Math.floor((base64Data.length * 3) / 4);
  if (estimatedBytes > MAX_UPLOAD_BYTES) {
    throw new Error('file_too_large_' + MAX_UPLOAD_BYTES);
  }

  const mimeType = String(fileDescriptor.mimeType || '').toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error('invalid_mime_type_' + mimeType);
  }

  const decoded = Utilities.base64Decode(base64Data);
  const safeFileName = String(fileDescriptor.filename || 'upload.bin').replace(/[\r\n]/g, ' ').slice(0, 120);
  const blob = Utilities.newBlob(decoded, mimeType, safeFileName);

  const file = DriveApp.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
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

function submissionExists(submissionId) {
  if (!submissionId) return false;
  const sheet = ensureSheet();
  const found = sheet
    .getRange('A:A')
    .createTextFinder(String(submissionId))
    .matchEntireCell(true)
    .findNext();
  return !!found;
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
