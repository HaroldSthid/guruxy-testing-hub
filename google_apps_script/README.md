# Google Apps Script Backend for GuruxyTestingHub

## Objective
Enable real web beta tester submissions that feed the QA Hub panels (SUS and Bugs).

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
    fetchIntervalMs: 30000
  };
</script>

Recommended placement: inside <head>, after Tailwind and before the main script block.

## 4) How it works
- Shared tester URL uses mode=public and a specific form (A/B/C).
- Tester submits responses on the web.
- Submission is sent to Google Apps Script.
- Admin hub polls GET endpoint and ingests new records.
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
