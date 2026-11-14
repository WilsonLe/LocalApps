# LocalCut UI adapter

[The LocalApps design system](../../../../DESIGN.md) owns the shadcn primitives.
This directory only owns LocalCut's Button adapter: an unavailable action that
uses this adapter is hidden. Use the shared Button when the workspace needs a
stable target with a visible disabled state. Preserve meaningful progress and
recovery controls; UI availability does not replace an edit's revision checks.

Use `pnpm typecheck` and the affected built workspace scenario. See
[workspace behavior](../../../docs/workspace.md) and the
[local development loop](../../../docs/development.md).
