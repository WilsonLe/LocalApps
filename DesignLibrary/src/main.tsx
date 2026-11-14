import { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, Layers, Moon, Sun } from "lucide-react";
import { Badge } from "@localapps/ui/badge";
import { Button, buttonVariants } from "@localapps/ui/button";
import { Example } from "./example";
import { ColorPair } from "./color-pair";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@localapps/ui/tabs";
import { Spinner } from "@localapps/ui/spinner";
import "./theme.css";

const PrimitiveExamples = lazy(() =>
  import("./primitives").then(({ PrimitiveExamples }) => ({
    default: PrimitiveExamples,
  })),
);
const PatternExamples = lazy(() =>
  import("./patterns").then(({ PatternExamples }) => ({
    default: PatternExamples,
  })),
);

const roles = [
  ["Background", "background", "foreground"],
  ["Card", "card", "card-foreground"],
  ["Popover", "popover", "popover-foreground"],
  ["Primary", "primary", "primary-foreground"],
  ["Secondary", "secondary", "secondary-foreground"],
  ["Muted", "muted", "muted-foreground"],
  ["Accent", "accent", "accent-foreground"],
  ["Destructive", "background", "destructive"],
];

function Foundations() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Example
        title="Color roles"
        description="Use the role that matches the surface or action. Contrast is measured against the selected theme."
        wide
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(([name, background, foreground]) => (
            <ColorPair
              key={name}
              name={name}
              background={background}
              foreground={foreground}
            />
          ))}
        </div>
      </Example>
      <Example
        title="Typography"
        description="System sans by default. LocalCut can choose separate interface and heading fonts."
      >
        <div className="font-heading text-3xl font-semibold tracking-tight">
          Untitled project
        </div>
        <div className="text-lg font-medium">Export settings</div>
        <div className="text-sm">Choose a file format to continue.</div>
        <code className="text-xs tabular-nums text-muted-foreground">
          00:01.24
        </code>
      </Example>
      <Example
        title="Shape and rhythm"
        description="Radii and elevation help distinguish controls, cards, and floating surfaces."
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid gap-2 text-xs">
            <div className="size-12 rounded-sm border bg-muted" />
            Small · field
          </div>
          <div className="grid gap-2 text-xs">
            <div className="size-12 rounded-md border bg-muted" />
            Medium · button
          </div>
          <div className="grid gap-2 text-xs">
            <div className="size-12 rounded-lg border bg-muted" />
            Large · menu
          </div>
          <div className="grid gap-2 text-xs">
            <div className="size-12 rounded-xl border bg-muted shadow-sm" />
            Extra large · dialog
          </div>
        </div>
      </Example>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(false);
  const base = import.meta.env.BASE_URL;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <a
            href={base.replace(/DesignLibrary\/$/, "")}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" /> LocalApps
          </a>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => {
              document.documentElement.classList.toggle("dark", !dark);
              setDark(!dark);
            }}
          >
            {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Badge variant="outline">
          <Layers aria-hidden="true" /> Shared design system
        </Badge>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Design Library
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          The colors, controls, and patterns used by LocalDesign and LocalCut.
        </p>
        <Tabs defaultValue="foundations" className="mt-9 gap-5">
          <TabsList
            aria-label="Component pyramid"
            className="flex w-fit flex-wrap"
          >
            <TabsTrigger value="foundations">Foundations</TabsTrigger>
            <TabsTrigger value="primitives">Primitives</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          <TabsContent value="foundations">
            <Foundations />
          </TabsContent>
          <TabsContent value="primitives">
            <Suspense fallback={<Spinner />}>
              <PrimitiveExamples />
            </Suspense>
          </TabsContent>
          <TabsContent value="patterns">
            <Suspense fallback={<Spinner />}>
              <PatternExamples dark={dark} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
