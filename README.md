# LocalApps

A library of apps that run in your browser. [Open the portal](https://wilsonle.github.io/LocalApps/).

- [LocalDesign](https://wilsonle.github.io/LocalApps/LocalDesign/) — canvas design editor. [Source and standalone setup](LocalDesign/README.md).
- [LocalCut](https://wilsonle.github.io/LocalApps/LocalCut/) — video and audio editor. [Source and standalone setup](LocalCut/README.md).

The app directories are independent copies of their original codebases. Their source, package managers and lockfiles remain unchanged. Root tooling only builds and assembles the portal and both apps for this repository's hosting path. Existing app documentation describes the original standalone repositories; the deployment described here owns LocalApps.

## Build and preview

Use Node 24 (`.nvmrc`) and pnpm 11.25.0. Install each app's pinned dependencies separately:

```sh
npm ci --prefix LocalDesign
pnpm --dir LocalCut install --frozen-lockfile
npm run build
npm test
npm run preview
```

Open `http://127.0.0.1:4188/LocalApps/`. `PORT` selects another preview port. Root tooling has no additional package dependencies. `dist/` is generated and ignored. The preview serves the real static artifact and the shared Pages fallback, including direct workspace routes.

`LOCALAPPS_BASE_PATH` defaults to `/LocalApps/`; set it to the absolute directory URL used by a different host. The build passes that base to each app's existing build interface, then copies complete production outputs, licenses and notices. Only generated app HTML receives a small route-restoration script; app source files are never rewritten. `node scripts/build-pages.mjs --assemble-only` assembles outputs already built for the selected base, rejecting mismatched HTML paths.

## Validation and GitHub Pages

Keep validation local. Before merging changes to this hosting setup, run the full app gates using their documented runtimes and available isolated ports:

```sh
# LocalDesign's standalone .nvmrc selects Node 22; install its Playwright Chromium first.
cd LocalDesign
LOCALDESIGN_TEST_PORT=4198 npm run check

# LocalCut uses Node 24 and installed stable Chrome.
cd ../LocalCut
LOCALCUT_TEST_PORT=4185 pnpm check

# Return to the library root and rebuild the combined artifact at its deployed base.
cd ..
npm run build
npm test
```

Also exercise both portal links and direct workspace reloads against the combined preview. The root routing tests retain encoded workspace IDs, query strings and fragments, and reject routes outside the target app. Existing app instructions own any additional checks applicable to changed app behavior.

Configure `WilsonLe/LocalApps` Pages to use **GitHub Actions**. The [root deployment workflow](.github/workflows/pages.yml) builds and publishes every push to `main`; manual dispatch is restricted to `main`. It packages `dist/` and deploys through the `github-pages` environment. It does not enable hosted test/performance workflows. Deployment permissions are scoped to the deploy job. Only compiled public app assets and the portal are published, with no source checkout or runtime credentials.

GitHub Pages has a shared site-level fallback. Root `404.html` sends app paths to that app's entry; an injected script restores the original path, query and fragment before application modules start. Unknown paths show a not-found page with a portal link. The fallback makes a short redirect through the app entry; it does not move workspace data. App `404.html` files are preserved for compatibility with other static hosts.

After deployment, verify `release.json` against the merged commit, open the portal and both apps, create disposable workspaces, reload their direct URLs, and check lazy modules, workers and fonts. LocalDesign also publishes `LocalDesign/release.json`; LocalCut's existing `LocalCut/build-info.json` reports its build commit.

Workspace data remains local to the browser and origin. This library does not copy or upload personal projects. Export portable backups before changing hosting origins; unrelated pages on a shared origin may access browser-local data.

Rollback through a reviewed revert or a known compatible Pages artifact. Preserve browser storage and retain complete matching assets; do not erase workspaces to recover a deployment.
