# Google Apps Script Backend for GuruxyTestingHub

## Objective
Enable real web beta tester submissions that feed the QA Hub panels (SUS and Bugs).

## Production URL (GitHub Pages)
- Live hub: https://haroldsthid.github.io/guruxy-testing-hub/

## 1) Create the Google Sheet
1. Create a new Google Spreadsheet.
2. Open Extensions > Apps Script.
3. Replace default content with Code.gs from this folder.
4. Save.

## 2) Deploy as Web App
1. Deploy > New deployment.
2. Type: Web app.
3. Execute as: Me.
4. Who has access: Anyone.
5. Deploy and copy the Web App URL.

The same URL supports:
- POST for saving submissions
- GET for fetching submissions

## 3) Configure the HTML app
In your HTML file, set GX_QA_CONFIG before the main script runs:

<script>
  window.GX_QA_CONFIG = {
    remoteProvider: 'google-apps-script',
    submitEndpoint: 'PASTE_YOUR_WEB_APP_URL_HERE',
    fetchEndpoint: 'PASTE_YOUR_WEB_APP_URL_HERE',
    readAdminToken: '', // keep empty in the committed bundle
    fetchIntervalMs: 30000
  };
</script>

Recommended placement: inside <head>, after Tailwind and before the main script block.

## 4) How it works
- Shared tester URL uses mode=public and a specific form (A/B/C).
- Tester submits responses on the web.
- Submission is sent to Google Apps Script.
- Admin hub polls GET endpoint with the read/admin token and ingests new records.
- SUS and Bugs panels are updated from ingested submissions.

## 5) Test checklist
1. Open app in admin mode and keep it open.
2. Generate tester link from Forms tab.
3. Open link in another browser or incognito.
4. Submit form with SUS score and optional bug text.
5. Return to admin tab and wait up to fetchIntervalMs.
6. Verify:
   - SUS history increased.
   - Bug list increased if bug text was submitted.

## 6) Notes
- Data is stored in the sheet tab named submissions.
- Duplicate protection is based on submission id.
- If you redeploy Apps Script, update endpoint URL in GX_QA_CONFIG.
- GET/readback is protected by the Apps Script script property `GX_READ_ADMIN_TOKEN`.
- Open the admin hub with `?mode=admin&readToken=...` or `?adminToken=...`; keep the committed HTML token field empty.
- The placeholders `CHANGE_ME_READ_ADMIN_TOKEN` and `PASTE_READ_ADMIN_TOKEN_HERE` are never accepted; if the script property is missing, blank, or still placeholder, GET returns unauthorized.
- POST remains public so testers can submit forms without the token.

## 7) Current hardening (P0)
- Duplicate prevention: server checks `id` before `appendRow` and returns `{ duplicate: true }` when repeated.
- Uploads are saved to the Drive evidence folder configured by `EVIDENCE_FOLDER_ID` in `Code.gs`.
- Upload size cap: `MAX_UPLOAD_BYTES = 10 MB`.
- Allowed upload MIME types:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `video/mp4`
  - `video/webm`
  - `application/pdf`
- Upload filename guard: CR/LF removed and filename truncated before write.
- Evidence URLs are stored in `answersJson` and become visible when reading submissions back through GET or spreadsheet review.
- Never commit a real read/admin token into this repository; keep `GX_QA_CONFIG.readAdminToken` empty and pass the token at admin-open time via URL.

## 8) Live QA smoke test (recommended for each release)
1. Open admin hub in a normal browser window.
2. Open a public form link in incognito (`?mode=public&form=A|B|C`).
3. Submit a valid response.
4. Confirm new data appears in admin after polling interval.
5. Re-submit same payload id (or retry network) and verify no duplicate row is created.
6. Submit a payload with HTML-like text (`<b>test</b>`) and verify rendered output is safe/plain text.
7. Try an invalid file type or size > 10 MB and verify controlled error behavior.

## 9) Operational guidance during active QA window
- Monitor cadence: review incoming bugs and SUS every 30-60 minutes.
- Escalation: treat `P0` as immediate triage and ownership assignment.
- Source of truth: deploy from `index.html` only; keep `guruxy_testing_hub_working.html` as a non-deploy working variant unless explicitly promoted.
