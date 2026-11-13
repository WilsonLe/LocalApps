# LocalApps design system

[Open the Design Library from the portal](README.md#build-and-preview), or run
`pnpm dev:library` from the workspace root to work on it directly.

| Level            | Owner                                                                                    | What belongs here                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations      | [Shared theme](packages/ui/src/theme.css)                                                | Neutral light and dark roles, type stacks, radii, and focus. Use semantic utilities such as `bg-background`, `text-muted-foreground`, and `ring-ring`.     |
| Primitives       | [`@localapps/ui`](packages/ui/src)                                                       | Base Vega buttons, fields, pickers, overlays, navigation, and feedback. Use the existing variants, sizes, and slots.                                       |
| Patterns         | [Shared components](packages/ui/src) and [live examples](DesignLibrary/src/patterns.tsx) | Compositions such as a labeled form, confirmation, project list, command search, or disclosure. Promote reusable behavior when a second consumer needs it. |
| Product surfaces | [LocalDesign](LocalDesign/src) and [LocalCut](LocalCut/src)                              | Editor layout, canvas, timeline, file and media behavior, menus with project commands, storage, and application state.                                     |

Both editors and the library import the same source and stylesheet. An app can
choose interface fonts and scale through the theme properties, without changing
artwork or media. The LocalDesign adapter keeps unavailable toolbar actions
visible and defaults to compact controls. LocalCut's action adapter hides an
unavailable action when its workspace policy calls for that. The shared Button
retains disabled state by default. For custom timeline hit targets, `bare` keeps
button semantics and lets the editor own geometry. The shared Input styles visible file fields and preserves
browser-native file, folder and color picker behavior. Canvas and media elements
and the third-party storyboard keep their own runtime contracts.

Use [the installed shadcn skill](.agents/skills/shadcn/SKILL.md) and Base Vega
with Base UI and Lucide. From the root, run
`pnpm --dir LocalCut exec shadcn info --json` and
`pnpm --dir LocalCut exec shadcn docs <component>`. The app configurations point
their UI and utility aliases into the shared package. Review registry code there,
apply semantic variants, and check both apps before changing a common contract.
Add a live example when a new component or interaction needs one. Keep labels,
focus return, touch, keyboard behavior, and reduced motion working. Retain the
Sonner notification adapter for LocalCut's existing notification service.

Run `pnpm check:ui` to catch raw controls, primitive-library imports and browser
prompts in product and library source, and missing component families in the library. Check real consumers as well as examples:
the boundary check cannot prove layout or behavior.

Shared source and the vendored [official shadcn skill](https://ui.shadcn.com/docs/skills)
are MIT licensed; see the [license](packages/ui/LICENSE). The skill files are
from [upstream commit e62c9435](https://github.com/shadcn-ui/ui/tree/e62c9435fff729a175f38983dee73b2cb4f6a069/skills/shadcn).
