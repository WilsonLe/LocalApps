# LocalDesign on GitHub Pages

LocalDesign is served at [LocalApps/LocalDesign](https://wilsonle.github.io/LocalApps/LocalDesign/).
The [LocalApps Pages runbook](../../README.md#validation-and-github-pages) owns
the deployment, artifact base, review and rollback. The imported standalone
workflow under LocalDesign is not executed by this repository.

Use the Node and pnpm versions from the LocalApps workspace and run
`pnpm --dir LocalDesign exec playwright install chromium` from its root before
running the editor's full local check. Use the combined production preview to
verify portal navigation and direct workspace reloads. For a standalone
LocalDesign preview, run `pnpm --dir LocalDesign build` and
`pnpm --dir LocalDesign preview` from the root.

After an authorized deployment, verify the SHA in LocalDesign/release.json.
Check blank drawing, inspector edits, skill retrieval and actual tool
discovery/edit/export in a WebMCP-capable browser. Confirm that direct links
restore their full URL and hashed assets load. Keep browser storage intact
during recovery; files and working copies do not sync between origins.

Export portable backups before rollback. Schema v3 files require a v3-capable
reader; keep the original working copies and archives intact.
