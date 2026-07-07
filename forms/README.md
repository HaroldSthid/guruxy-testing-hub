# Versioned form editing guide

This project keeps form content in `forms/catalog.js` and stores a snapshot of the active form in each submission under `answersJson.__meta`.

## Editing rule

- If a form version has no tester responses yet, small copy/option fixes can be made in place.
- If a form version already has tester responses, do not edit it in place. Create a new version and move `activeVersion` to the new version.
- Never delete a version that has tester responses.

## Create a new version

1. Copy the current active version inside the form's `versions` object.
2. Rename the copy, for example from `v1` to `v2`.
3. Set the previous version status to `archived`.
4. Edit questions/options only in the new version.
5. Update `activeVersion` to the new version.
6. Run:

```powershell
node .\scripts\validate-forms-catalog.mjs
node .\scripts\verify-frontend-contracts.mjs
```

## Question IDs

- Keep the same question ID when the semantic measurement remains the same.
- Use a new question ID when the question measures something materially different.
- Do not reuse a removed question ID for a different meaning.

## Why snapshots matter

Each submission stores the exact form version and question/options snapshot seen by the tester. This keeps historical answers interpretable even after active questions change.
