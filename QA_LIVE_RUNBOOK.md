# Guruxy Testing Hub - Live QA Runbook

## Scope
This runbook is for the active QA delivery window on GitHub Pages.

## Environments
- Public hub URL: https://haroldsthid.github.io/guruxy-testing-hub/
- Validation target: https://dev.guruxy.com/

## Canonical frontend source
- Deploy source: `index.html`
- Working variant (non-deploy by default): `guruxy_testing_hub_working.html`

## Start-of-shift checks (5-10 min)
1. Open the public hub URL and confirm page renders.
2. Confirm objective counters and tabs load without console errors.
3. Confirm Apps Script endpoints are reachable from the deployed build.
4. Execute one public form submission from incognito.
5. Verify ingestion appears in admin view within polling window.

## Data integrity checks
1. Duplicate protection: retry same submission id and confirm no duplicate row in `submissions`.
2. Sanitization: submit text containing HTML tags and confirm it renders as plain text.
3. Evidence uploads: validate image/PDF/video uploads up to 10 MB; confirm they land in the Drive evidence folder and the URLs are written to `answersJson` for later review via GET/readback.
4. Readback protection: confirm GET requests without the read/admin token return `{ ok:false, error:'unauthorized' }` and no items.
5. Confirm the committed placeholders `CHANGE_ME_READ_ADMIN_TOKEN` and `PASTE_READ_ADMIN_TOKEN_HERE` do not authorize readback.
6. Never delete Spreadsheet rows to "reset" a campaign; back up/archive first.

## Lightweight deterministic checks
1. Run `node .\scripts\verify-frontend-contracts.mjs`.
2. Confirm reference toggles hide legacy media when `reference.enabled=false`.
3. Confirm Google Apps Script submit parsing treats application-level `{ ok: false }` as failure.
4. Confirm the versioned form catalog is loaded from `forms/catalog.js` and submissions carry snapshot metadata plus `testRun`/`cohort` under `answers.__meta`.

## Incident triage
- P0: Blocking issue preventing task completion. Escalate immediately and assign owner.
- P1: High friction requiring moderator intervention. Log and prioritize in next fix batch.
- P2/P3: Medium/minor friction. Track and batch for planned maintenance.

## Hourly operating loop
1. Review bug stream and count P0/P1.
2. Review SUS average trend and total sample size.
3. Confirm no backend ingestion anomalies (sudden drops, duplicate spikes, upload errors).
4. Post short status update to QA thread.

## Release-change checklist
1. Apply changes in `index.html` first.
2. Re-run smoke test on GitHub Pages URL.
3. Verify one end-to-end submission.
4. If Apps Script redeployed, update endpoint URL in `GX_QA_CONFIG`.
5. Set the Apps Script script property `GX_READ_ADMIN_TOKEN`, keep the committed HTML token field empty, and open admin with `?mode=admin`, then paste the token into the session-only admin screen.
6. POST stays public; do not add the token to submit requests.
7. Publish change note to QA team.
8. If adding new help images, publish them with `scripts/publish-asset.ps1`, verify the GitHub URL, and update `mediaUrl` with Raw URL (main).
