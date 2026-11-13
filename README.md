# LocalApps

A library of apps that run in your browser. [Open the portal](https://wilsonle.github.io/LocalApps/).

- [LocalDesign](https://wilsonle.github.io/LocalApps/LocalDesign/) — canvas design editor. [Source and setup](LocalDesign/README.md).
- [LocalCut](https://wilsonle.github.io/LocalApps/LocalCut/) — video and audio editor. [Source and setup](LocalCut/README.md).

Both editors share [the shadcn design system](DESIGN.md), with a browsable
Design Library linked from the portal. The editor, engine and storage code
remain in each app. See the [workspace decision](docs/adr/0001-shared-ui-workspace.md)
for ownership and packaging.

## Build and preview

Use Node 24 (see `.nvmrc`) and pnpm 11.25.0. Install once at the workspace root:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm preview
```

Open [the local portal](http://127.0.0.1:4188/LocalApps/). Use `PORT` to select another preview port.
The preview serves the built portal, both apps and the Design Library at
`/LocalApps/DesignLibrary/`. For component work, run `pnpm dev:library` instead and
open [the library dev server](http://127.0.0.1:4194/DesignLibrary/).

`LOCALAPPS_BASE_PATH` defaults to `/LocalApps/`; set it to the absolute directory
URL used by a different host. The build assembles the three complete outputs,
licenses and notices. Only generated editor HTML receives route restoration.
Run `node scripts/build-pages.mjs --assemble-only` to assemble outputs already
built for the selected base. It rejects mismatched asset paths.

## Validation and GitHub Pages

Keep validation local. Before merging changes to this hosting setup, run the full app gates using their documented runtimes and available isolated ports:

```sh
pnpm --dir LocalDesign exec playwright install chromium
LOCALDESIGN_TEST_PORT=4198 pnpm --dir LocalDesign check
LOCALCUT_TEST_PORT=4185 pnpm --dir LocalCut check  # uses installed stable Chrome
pnpm build
pnpm test
```

Also exercise the portal links, the Design Library and direct workspace reloads against the combined preview. The root routing tests retain encoded workspace IDs, query strings and fragments, and reject routes outside the target app. Existing app instructions own any additional checks applicable to changed app behavior.

Configure `WilsonLe/LocalApps` Pages to use **GitHub Actions**. The [root deployment workflow](.github/workflows/pages.yml) builds and publishes every push to `main`; manual dispatch is restricted to `main`. It packages `dist/` and deploys through the `github-pages` environment. It does not enable hosted test/performance workflows. Deployment permissions are scoped to the deploy job. Only compiled public assets and the portal are published, with no source checkout or runtime credentials.

GitHub Pages has a shared site-level fallback. Root `404.html` sends app paths to that app's entry; an injected script restores the original path, query and fragment before application modules start. Unknown paths show a not-found page with a portal link. The fallback makes a short redirect through the app entry; it does not move workspace data. App `404.html` files are preserved for compatibility with other static hosts.

After deployment, verify `release.json` against the merged commit, open the portal, both apps and the Design Library, create disposable workspaces, reload their direct URLs, and check lazy modules, workers and fonts. LocalDesign also publishes `LocalDesign/release.json`; LocalCut's existing `LocalCut/build-info.json` reports its build commit.

Workspace data remains local to the browser and origin. This library does not copy or upload personal projects. Export portable backups before changing hosting origins; unrelated pages on a shared origin may access browser-local data.

Rollback through a reviewed revert or a known compatible Pages artifact. Preserve browser storage and retain complete matching assets; do not erase workspaces to recover a deployment.
