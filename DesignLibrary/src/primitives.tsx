import { useState } from "react";
import { CircleAlert, FolderOpen, Info, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@localapps/ui/alert";
import { Badge } from "@localapps/ui/badge";
import { Button } from "@localapps/ui/button";
import { Checkbox } from "@localapps/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@localapps/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@localapps/ui/field";
import { Input } from "@localapps/ui/input";
import { Label } from "@localapps/ui/label";
import { NativeSelect } from "@localapps/ui/native-select";
import { Progress, ProgressLabel, ProgressValue } from "@localapps/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@localapps/ui/select";
import { Separator } from "@localapps/ui/separator";
import { Skeleton } from "@localapps/ui/skeleton";
import { Slider } from "@localapps/ui/slider";
import { Spinner } from "@localapps/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@localapps/ui/table";
import { Textarea } from "@localapps/ui/textarea";
import { Tooltip } from "@localapps/ui/tooltip";
import { Example } from "./example";

const fonts = ["System sans", "System serif", "Monospace"];
const formats = [
  { value: "png", label: "PNG image" },
  { value: "svg", label: "SVG vector" },
];

const states = ["Rest", "Hover", "Focus", "Pressed", "Disabled"] as const;

function ButtonStates() {
  return (
    <Example
      title="Button states"
      description="Review the same actions at rest, on hover, on keyboard focus, and while pressed."
      wide
    >
      <Table
        aria-label="Button variants and states"
        containerProps={{
          tabIndex: 0,
          role: "region",
          "aria-label": "Scrollable button states",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Variant</TableHead>
            {states.map((state) => (
              <TableHead key={state} scope="col">
                {state}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(
            [
              ["Primary", "default", "Save draft"],
              ["Outline", "outline", "Preview"],
              ["Destructive", "destructive", "Remove"],
            ] as const
          ).map(([name, variant, label]) => (
            <TableRow key={variant}>
              <TableHead scope="row">{name}</TableHead>
              {states.map((state) => (
                <TableCell key={state}>
                  <Button
                    variant={variant}
                    size="sm"
                    tabIndex={-1}
                    disabled={state === "Disabled"}
                    data-preview={
                      state === "Pressed" ? "active" : state.toLowerCase()
                    }
                  >
                    {label}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Example>
  );
}

export function PrimitiveExamples() {
  const [volume, setVolume] = useState(65);
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Example
        title="Actions"
        description="Primary, secondary, outline, ghost, and destructive actions."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setAction("Project created")}>
            <Plus data-icon="inline-start" /> New project
          </Button>
          <Button
            variant="secondary"
            onClick={() => setAction("Project duplicated")}
          >
            Duplicate
          </Button>
          <Button variant="outline" onClick={() => setAction("Preview opened")}>
            Preview
          </Button>
          <Button variant="ghost" onClick={() => setAction("Help opened")}>
            Help
          </Button>
          <Button
            variant="destructive"
            onClick={() => setAction("Draft removed")}
          >
            Remove
          </Button>
          <Button disabled>Export</Button>
          <Tooltip content="Open project" toggleOnClick>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Open project"
              onClick={() => setAction("Project opened")}
            >
              <FolderOpen aria-hidden="true" />
            </Button>
          </Tooltip>
        </div>
        <p role="status" className="min-h-5 text-sm text-muted-foreground">
          {action}
        </p>
      </Example>
      <Example
        title="Selection and range"
        description="Use a checkbox for a setting and a slider for a bounded value."
      >
        <Checkbox label="Snap to guides" defaultChecked />
        <Separator />
        <div className="grid gap-3">
          <div className="flex justify-between gap-2 text-sm">
            <span>Preview volume</span>
            <output className="text-muted-foreground tabular-nums">
              {volume}%
            </output>
          </div>
          <Slider
            label="Preview volume"
            value={volume}
            onValueChange={setVolume}
          />
        </div>
      </Example>
      <Example
        title="Form fields"
        description="Keep the label visible and connect errors and hints to the field."
      >
        <Field data-invalid={name.trim() === ""}>
          <FieldLabel htmlFor="example-name">Project name</FieldLabel>
          <Input
            id="example-name"
            value={name}
            placeholder="Untitled"
            onChange={(event) => setName(event.target.value)}
            aria-invalid={name.trim() === ""}
            aria-describedby={
              name.trim() === "" ? "example-name-error" : undefined
            }
          />
          {name.trim() === "" && (
            <FieldError id="example-name-error">
              Enter a project name.
            </FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="example-notes">Notes</FieldLabel>
          <Textarea
            id="example-notes"
            placeholder="Add a note for this project"
          />
        </Field>
      </Example>
      <Example
        title="Pickers"
        description="Use search for long lists and native controls when the browser owns the picker."
      >
        <Field>
          <FieldLabel htmlFor="example-format">Export format</FieldLabel>
          <Select items={formats} defaultValue="png">
            <SelectTrigger id="example-format" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel id="example-font-label">Interface font</FieldLabel>
          <Combobox items={fonts} defaultValue={fonts[0]}>
            <ComboboxTrigger aria-labelledby="example-font-label">
              <ComboboxValue />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput
                aria-label="Search fonts"
                placeholder="Search fonts…"
              />
              <ComboboxEmpty>No matching fonts.</ComboboxEmpty>
              <ComboboxList>
                {(font: string) => (
                  <ComboboxItem key={font} value={font}>
                    {font}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
        <Field>
          <FieldLabel htmlFor="example-quality">Quality</FieldLabel>
          <NativeSelect id="example-quality" defaultValue="high">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </NativeSelect>
        </Field>
        <Field orientation="horizontal">
          <Label htmlFor="example-color">Fill color</Label>
          <Input
            id="example-color"
            type="color"
            className="h-8 w-12 cursor-pointer"
            defaultValue="#7289c2"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="example-file">Local image</FieldLabel>
          <Input id="example-file" type="file" accept="image/*" />
          <FieldDescription>Files stay on this device.</FieldDescription>
        </Field>
      </Example>
      <ButtonStates />
      <Example
        title="Status and feedback"
        description="Progress for measured work, a spinner for waiting, and a skeleton for reserved space."
        wide
      >
        <div className="grid items-start gap-5 sm:grid-cols-2">
          <div className="grid gap-4">
            <Progress value={45}>
              <ProgressLabel>Exporting project</ProgressLabel>
              <ProgressValue />
            </Progress>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Ready</Badge>
              <Badge variant="outline">Draft</Badge>
              <Badge variant="destructive">Missing</Badge>
              <Badge variant="secondary">
                <Spinner aria-hidden="true" /> Saving
              </Badge>
            </div>
            <div
              className="flex items-center gap-3"
              aria-label="Loading project"
              role="status"
            >
              <Skeleton className="size-10 rounded-md" />
              <div className="grid gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <Alert>
              <Info />
              <AlertTitle>Saved locally</AlertTitle>
              <AlertDescription>
                Your changes are available on this device.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Media missing</AlertTitle>
              <AlertDescription>
                Reconnect the file to export this project.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Example>
    </div>
  );
}
