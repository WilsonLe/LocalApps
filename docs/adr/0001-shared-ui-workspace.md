# 0001: Share the design system in one workspace

**Status:** Accepted for LocalApps.

LocalDesign and LocalCut imported separate copies of the same neutral theme and
shadcn controls. Keeping those copies in sync requires each app to make the
same fixes and validate independently selected React and Base UI versions.

Use one pnpm lockfile and a private source package, @localapps/ui. Each app
still owns its Vite entry, lazy editor paths, product state, and browser storage.
The library builds a third independent entry from the same components. The
package has no app dependency and introduces no shared project store or service.
Bundling each editor independently keeps either editor loadable without the
other editor or the library.

A shared Git package with independent locks would still need coordinated
dependency updates. Copying registry sources to each app would preserve
standalone installs but leave the design system duplicated. The tradeoff of
this choice is that a source checkout needs the LocalApps root; a published
app remains a self-contained static artifact. A reviewed revert can restore
the previous packaging and lockfiles without migrating browser data.
