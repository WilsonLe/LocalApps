import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@localapps/ui/accordion";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@localapps/ui/alert-dialog";
import { Badge } from "@localapps/ui/badge";
import { Button } from "@localapps/ui/button";
import { CollapsibleDisclosure } from "@localapps/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@localapps/ui/command";
import { ContextMenu } from "@localapps/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@localapps/ui/dialog";
import { DropdownMenu } from "@localapps/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@localapps/ui/empty";
import { Field, FieldLabel } from "@localapps/ui/field";
import { Input } from "@localapps/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@localapps/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@localapps/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@localapps/ui/resizable";
import { Toaster, toast } from "@localapps/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@localapps/ui/table";
import { Example } from "./example";

const pages = [
  [
    ["Storyboard", "Ready"],
    ["Title cards", "Draft"],
  ],
  [
    ["Product demo", "Ready"],
    ["Audio edit", "Draft"],
  ],
];

function OverlayExamples() {
  const [name, setName] = useState("Storyboard");
  const [draftName, setDraftName] = useState(name);
  return (
    <Example
      title="Overlays"
      description="Dialogs ask for input; popovers keep brief details next to the trigger."
    >
      <div className="flex flex-wrap gap-2">
        <Dialog
          onOpenChange={(open) => {
            if (open) setDraftName(name);
          }}
        >
          <DialogTrigger render={<Button variant="outline" />}>
            Rename project
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <DialogDescription>
                Give this project a name you can recognize.
              </DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="rename-example">Name</FieldLabel>
              <Input
                id="rename-example"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
              />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose
                render={<Button />}
                onClick={() => {
                  setName(draftName.trim());
                  toast.success("Project renamed");
                }}
                disabled={!draftName.trim()}
              >
                Save name
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Remove draft
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this draft?</AlertDialogTitle>
              <AlertDialogDescription>
                The draft will be removed from this example.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="outline" />}>
                Cancel
              </AlertDialogClose>
              <AlertDialogClose
                render={<Button variant="destructive" />}
                onClick={() => toast.success("Draft removed")}
              >
                Remove draft
              </AlertDialogClose>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Project details
          </PopoverTrigger>
          <PopoverContent className="grid gap-1">
            <PopoverTitle className="font-medium">Project details</PopoverTitle>
            <PopoverDescription className="text-muted-foreground">
              1920 × 1080 · 30 fps
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      </div>
    </Example>
  );
}

function MenuExamples() {
  return (
    <Example
      title="Menus"
      description="Group related actions. Put a visible menu beside anything with a context menu."
    >
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger render={<Button variant="outline" />}>
            Project actions
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Positioner sideOffset={6} className="z-50">
              <DropdownMenu.Popup>
                <DropdownMenu.Item
                  onClick={() => toast.success("Project duplicated")}
                >
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => toast.success("Project archived")}
                >
                  Archive
                </DropdownMenu.Item>
                <DropdownMenu.Item disabled>Export</DropdownMenu.Item>
              </DropdownMenu.Popup>
            </DropdownMenu.Positioner>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <ContextMenu.Root>
          <ContextMenu.Trigger className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
            Right-click for actions
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner className="z-50">
              <ContextMenu.Popup>
                <ContextMenu.Item
                  onClick={() => toast.success("Project duplicated")}
                >
                  Duplicate
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={() => toast.success("Project archived")}
                >
                  Archive
                </ContextMenu.Item>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>
    </Example>
  );
}

export function PatternExamples({ dark }: { dark: boolean }) {
  const [page, setPage] = useState(0);
  return (
    <>
      <Toaster theme={dark ? "dark" : "light"} />
      <div className="grid gap-4 md:grid-cols-2">
        <OverlayExamples />
        <MenuExamples />
        <Example
          title="Project list"
          description="A table for comparable project data, with compact pagination."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages[page].map(([project, status]) => (
                <TableRow key={project}>
                  <TableCell>{project}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              {pages.map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    aria-label={"Page " + (index + 1)}
                    isActive={page === index}
                    onClick={() => setPage(index)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </Example>
        <Example
          title="Empty project library"
          description="Name what’s missing and provide one way to get started."
        >
          <Empty className="min-h-42 gap-3 rounded-lg border border-dashed p-4 md:p-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle as="h2">No projects yet</EmptyTitle>
              <EmptyDescription>
                Projects you create appear here.
              </EmptyDescription>
            </EmptyHeader>
            <Button size="sm" onClick={() => toast.success("Project created")}>
              <Plus data-icon="inline-start" /> New project
            </Button>
          </Empty>
        </Example>
        <Example
          title="Progressive disclosure"
          description="Collapse optional settings and keep the main editor controls in view."
        >
          <CollapsibleDisclosure summary="Canvas options">
            <p className="pb-3 text-sm text-muted-foreground">
              Control the grid, guides, and canvas background.
            </p>
          </CollapsibleDisclosure>
          <Accordion className="border-t">
            <AccordionItem value="appearance">
              <AccordionTrigger>Appearance</AccordionTrigger>
              <AccordionContent>
                Choose the theme, type size, and interface scale.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shortcuts">
              <AccordionTrigger>Keyboard shortcuts</AccordionTrigger>
              <AccordionContent>
                Review the shortcuts for your current workspace.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>
        <Example
          title="Command search"
          description="Filter actions by name and select with the keyboard or pointer."
        >
          <Command className="rounded-lg border">
            <CommandInput
              aria-label="Search commands"
              placeholder="Find a command…"
            />
            <CommandList>
              <CommandEmpty>No matching commands.</CommandEmpty>
              <CommandGroup heading="Projects">
                <CommandItem onSelect={() => toast.success("Project created")}>
                  Create project
                </CommandItem>
                <CommandItem onSelect={() => toast.success("Projects opened")}>
                  Open projects
                </CommandItem>
                <CommandItem onSelect={() => toast.success("Settings opened")}>
                  Open settings
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Example>
        <Example
          title="Action hierarchy"
          description="Use one primary action per group. Use an outline action for a related alternative."
          wide
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-sm font-medium">Preferred</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("Project saved")}>
                  Save project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast("Preview ready")}
                >
                  Preview
                </Button>
              </div>
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-sm font-medium text-destructive">
                Avoid equal emphasis
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("Project saved")}>
                  Save project
                </Button>
                <Button onClick={() => toast("Preview ready")}>Preview</Button>
              </div>
            </div>
          </div>
        </Example>
        <Example
          title="Resizable workspace"
          description="Drag the divider or use arrow keys on the handle to change the available space."
          wide
        >
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-28 rounded-lg border"
          >
            <ResizablePanel
              id="library-layers"
              defaultSize="38%"
              minSize="22%"
              className="grid place-items-center bg-muted text-sm"
            >
              Layers
            </ResizablePanel>
            <ResizableHandle aria-label="Resize layers panel" withHandle />
            <ResizablePanel
              id="library-preview"
              defaultSize="62%"
              minSize="25%"
              className="grid place-items-center text-sm"
            >
              Preview
            </ResizablePanel>
          </ResizablePanelGroup>
        </Example>
      </div>
    </>
  );
}
