import { Tabs, TabsContent, TabsList, TabsTrigger } from "@localapps/ui/tabs";
import { Label } from "@localapps/ui/label";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "@localapps/ui/input";
import { NativeSelect } from "@localapps/ui/native-select";
import { Textarea } from "@localapps/ui/textarea";
import type { DesignEngine } from "../core/engine";
import type { Command } from "../core/commands";
import { roots, uid, type DesignDocument } from "../core/model";
import { bounds } from "../core/geometry";
import { pngExport } from "../files/export";
import { validateRasterAssets } from "../files/raster";
import { base64 } from "../render/fonts";
import { TokenResources } from "./TokenResources";
import { IconResources } from "./IconResources";
import { ComponentResources } from "./ComponentResources";
import { HistoryResources } from "./HistoryResources";
import { ReviewResources } from "./ReviewResources";
import { PrototypeResources } from "./Prototype";
import { PackageResources } from "./PackageResources";
import { HandoffResources } from "./HandoffResources";
const resourceTabs = [
  "context",
  "pages",
  "tokens",
  "icons",
  "components",
  "history",
  "review",
  "prototype",
  "packages",
  "handoff",
] as const;

export function DesignResources({
  engine,
  document: doc,
  onError,
  onClose,
}: {
  engine: DesignEngine;
  document: DesignDocument;
  onError: (message: string) => void;
  onClose: () => void;
}) {
  const [guideId, setGuideId] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [decision, setDecision] = useState("");
  const [rationale, setRationale] = useState("");
  const [author, setAuthor] = useState("You");
  const [referenceTitle, setReferenceTitle] = useState("");
  const [provenance, setProvenance] = useState("");
  const [destination, setDestination] = useState(engine.pageId);
  const [busy, setBusy] = useState(false);
  const run = (commands: Command[]) => {
    try {
      engine.dispatch(commands);
      return true;
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
      return false;
    }
  };
  const pin = async () => {
    setBusy(true);
    const guard = engine.guard(),
      current = engine.document,
      selected = [...engine.selection],
      page = engine.pageId;
    try {
      if (!selected.length) throw new Error("Select a frame or layers to pin.");
      const blob = await pngExport(current, page, selected);
      const geometry = bounds(current, roots(current, selected));
      const asset = {
        id: uid(),
        name: referenceTitle.trim() || "Reference",
        mime: "image/png" as const,
        data: `data:image/png;base64,${base64(new Uint8Array(await blob.arrayBuffer()))}`,
        width: Math.ceil(geometry.width),
        height: Math.ceil(geometry.height),
      };
      await validateRasterAssets([asset]);
      engine.edit({
        ...guard,
        commands: [
          { op: "asset_add", asset },
          {
            op: "reference_set",
            reference: {
              id: uid(),
              title: asset.name,
              assetId: asset.id,
              provenance: provenance.trim() || `Captured from ${current.name}`,
              sourceDocumentId: current.id,
              sourceRevision: current.revision,
            },
          },
        ],
      });
      setReferenceTitle("");
      setProvenance("");
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };
  const reorder = (id: string, delta: number) => {
    const ids = doc.pages.map((p) => p.id),
      index = ids.indexOf(id),
      target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run([{ op: "pages_reorder", pageIds: ids }]);
  };
  return (
    <Tabs defaultValue="context" className="design-resources gap-0">
      <TabsList
        activateOnFocus
        className="resource-tabs rounded-none bg-transparent p-0 pb-2.5"
        aria-label="Design resources"
      >
        {resourceTabs.map((value) => (
          <TabsTrigger
            key={value}
            value={value}
            render={<Button size="sm" />}
            className="shrink-0 min-h-8 data-active:bg-secondary data-active:shadow-none"
          >
            {value === "context"
              ? "Context"
              : value === "tokens"
                ? "Tokens"
                : value === "icons"
                  ? "Icons"
                  : value === "components"
                    ? "Components"
                    : value === "history"
                      ? "History"
                      : value === "review"
                        ? "Review"
                        : value === "prototype"
                          ? "Prototype"
                          : value === "packages"
                            ? "Packages"
                            : value === "handoff"
                              ? "Handoff"
                              : "Pages"}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="handoff">
        <HandoffResources engine={engine} document={doc} onError={onError} />
      </TabsContent>
      <TabsContent value="packages">
        <PackageResources engine={engine} document={doc} onError={onError} />
      </TabsContent>
      <TabsContent value="prototype">
        <PrototypeResources
          engine={engine}
          document={doc}
          onError={onError}
          onPlay={onClose}
        />
      </TabsContent>
      <TabsContent value="review">
        <ReviewResources
          engine={engine}
          document={doc}
          onError={onError}
          onNavigate={onClose}
        />
      </TabsContent>
      <TabsContent value="history">
        <HistoryResources engine={engine} document={doc} onError={onError} />
      </TabsContent>
      <TabsContent value="components">
        <ComponentResources
          engine={engine}
          document={doc}
          onError={onError}
          onInserted={onClose}
        />
      </TabsContent>
      <TabsContent value="icons">
        <IconResources engine={engine} onError={onError} onInserted={onClose} />
      </TabsContent>
      <TabsContent value="tokens">
        <TokenResources engine={engine} document={doc} onError={onError} />
      </TabsContent>
      <TabsContent value="context" className="resource-sections">
        <section>
          <h3>Guidelines</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                run([
                  {
                    op: "guideline_set",
                    guideline: {
                      id: guideId || uid(),
                      name: name.trim(),
                      content,
                    },
                  },
                ])
              ) {
                setGuideId("");
                setName("");
                setContent("");
              }
            }}
          >
            <Label layout="stacked">
              Guide
              <NativeSelect
                aria-label="Choose guideline"
                value={guideId}
                onChange={(e) => {
                  const guide = doc.guidelines.find(
                    (g) => g.id === e.target.value,
                  );
                  setGuideId(guide?.id ?? "");
                  setName(guide?.name ?? "");
                  setContent(guide?.content ?? "");
                }}
              >
                <option value="">New guideline</option>
                {doc.guidelines.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </NativeSelect>
            </Label>
            <Label layout="stacked">
              Name
              <Input
                aria-label="Guideline name"
                required
                maxLength={200}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Label>
            <Label layout="stacked">
              Rules
              <Textarea
                aria-label="Guideline rules"
                required
                maxLength={24000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Label>
            <div className="button-row">
              <Button type="submit">Save guideline</Button>
              {guideId && (
                <Button
                  type="button"
                  onClick={() => {
                    if (run([{ op: "guideline_delete", id: guideId }])) {
                      setGuideId("");
                      setName("");
                      setContent("");
                    }
                  }}
                >
                  Delete guideline
                </Button>
              )}
            </div>
          </form>
        </section>
        <section>
          <h3>Decisions</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                run([
                  {
                    op: "decision_add",
                    decision: {
                      id: uid(),
                      decision,
                      rationale,
                      author: author.trim(),
                      createdAt: new Date().toISOString(),
                    },
                  },
                ])
              ) {
                setDecision("");
                setRationale("");
              }
            }}
          >
            <Label layout="stacked">
              Decision
              <Textarea
                aria-label="Decision"
                required
                maxLength={500}
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              />
            </Label>
            <Label layout="stacked">
              Reason
              <Textarea
                aria-label="Decision reason"
                required
                maxLength={1000}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
              />
            </Label>
            <Label layout="stacked">
              By
              <Input
                aria-label="Decision author"
                required
                maxLength={80}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Label>
            <Button type="submit">Record decision</Button>
          </form>
          <ol className="resource-records">
            {doc.decisions.map((record) => (
              <li key={record.id}>
                <strong>{record.decision}</strong>
                <p>{record.rationale}</p>
                <span>{record.author}</span>
                <Button
                  aria-label={`Delete decision ${record.decision}`}
                  onClick={() =>
                    run([{ op: "decision_delete", id: record.id }])
                  }
                >
                  Delete
                </Button>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3>References</h3>
          <Label layout="stacked">
            Title
            <Input
              aria-label="Reference title"
              maxLength={200}
              value={referenceTitle}
              onChange={(e) => setReferenceTitle(e.target.value)}
            />
          </Label>
          <Label layout="stacked">
            Source
            <Input
              aria-label="Reference source"
              maxLength={1000}
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
            />
          </Label>
          <Button
            disabled={busy || !engine.selection.length}
            onClick={() => void pin()}
          >
            Pin selection
          </Button>
          <div className="reference-grid">
            {doc.references.map((reference) => (
              <figure key={reference.id}>
                <img
                  src={doc.assets.find((a) => a.id === reference.assetId)?.data}
                  alt={reference.title}
                />
                <figcaption>
                  <strong>{reference.title}</strong>
                  <p>{reference.provenance}</p>
                </figcaption>
                <Button
                  aria-label={`Delete reference ${reference.title}`}
                  onClick={() =>
                    run([{ op: "reference_delete", id: reference.id }])
                  }
                >
                  Delete
                </Button>
              </figure>
            ))}
          </div>
        </section>
      </TabsContent>
      <TabsContent value="pages" className="resource-sections">
        <section>
          <h3>Page order</h3>
          <ol className="resource-records">
            {doc.pages.map((page, index) => (
              <li key={page.id}>
                <strong>{page.name}</strong>
                <div className="button-row">
                  <Button
                    disabled={!index}
                    aria-label={`Move ${page.name} earlier`}
                    onClick={() => reorder(page.id, -1)}
                  >
                    Earlier
                  </Button>
                  <Button
                    disabled={index === doc.pages.length - 1}
                    aria-label={`Move ${page.name} later`}
                    onClick={() => reorder(page.id, 1)}
                  >
                    Later
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3>Move selection</h3>
          <Label layout="stacked">
            Destination page
            <NativeSelect
              aria-label="Destination page"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {doc.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </NativeSelect>
          </Label>
          <Button
            disabled={
              !engine.selection.length ||
              !doc.pages.some((p) => p.id === destination)
            }
            onClick={() => {
              const ids = [...engine.selection];
              if (run([{ op: "move_to_page", ids, pageId: destination }]))
                engine.select(ids, destination);
            }}
          >
            Move to page
          </Button>
        </section>
      </TabsContent>
    </Tabs>
  );
}
