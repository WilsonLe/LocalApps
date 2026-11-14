# LocalApps workspace

- Read the [design system guide](DESIGN.md) before changing UI and the nearest app guidance ([LocalDesign](LocalDesign/AGENTS.md), [LocalCut](LocalCut/AGENTS.md)) before changing editor behavior.
- Put shared tokens and shadcn Base Vega controls in [packages/ui](packages/ui/src). The [official shadcn skill](.agents/skills/shadcn/SKILL.md) and both app component configs use this workspace. Product state and specialized editor geometry stay in the apps.
- Install once from this root using Node 24 and `pnpm install --frozen-lockfile`. Use `pnpm check:ui` and the affected app checks. [README](README.md) owns the combined preview and GitHub Pages delivery.
