import { Label } from "@localapps/ui/label";
import { Checkbox } from "@localapps/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "@localapps/ui/input";
import { NativeSelect } from "@localapps/ui/native-select";
import { DesignEngine, type Receipt } from "../core/engine";
import type { EditRequest } from "../core/commands";
import { uid, type DesignDocument } from "../core/model";
import { checkpointDiff, checkpointDocument } from "../core/checkpoints";
import { pngExport } from "../files/export";
export function HistoryResources({
  engine,
  document: doc,
  onError,
}: {
  engine: DesignEngine;
  document: DesignDocument;
  onError: (s: string) => void;
}) {
  const [target, setTarget] = useState(
    engine.selection[0] ? `frame:${engine.selection[0]}` : "",
  );
  const [label, setLabel] = useState("");
  const [author, setAuthor] = useState("You");
  const [id, setId] = useState("");
  const [mode, setMode] = useState<"frozen" | "linked">("frozen");
  const [dependencies, setDependencies] = useState(false);
  const [drop, setDrop] = useState(false);
  const [pending, setPending] = useState<{
    request: EditRequest;
    receipt: Receipt;
  } | null>(null);
  const [preview, setPreview] = useState("");
  const checkpoint = doc.checkpoints.find((item) => item.id === id);
  const diff = checkpoint && checkpointDiff(doc, checkpoint);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const attempt = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
    }
  };
  return (
    <div className="resource-sections">
      <section>
        <h3>Create checkpoint</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            attempt(() => {
              const [kind, targetId] = target.split(":");
              const checkpointId = uid();
              engine.dispatch([
                {
                  op: "checkpoint_create",
                  id: checkpointId,
                  kind: kind as "frame" | "component",
                  targetId,
                  label,
                  author,
                },
              ]);
              setId(checkpointId);
              setLabel("");
            });
          }}
        >
          <Label layout="stacked">
            Target
            <NativeSelect
              aria-label="Checkpoint target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="">Choose frame or component</option>
              {doc.nodes
                .filter((node) => node.type === "frame" && !node.componentPart)
                .map((node) => (
                  <option key={node.id} value={`frame:${node.id}`}>
                    {node.name} · Frame
                  </option>
                ))}
              {doc.components
                .filter((item) => !item.deleted)
                .map((item) => (
                  <option key={item.id} value={`component:${item.id}`}>
                    {item.name} · Component
                  </option>
                ))}
            </NativeSelect>
          </Label>
          <Label layout="stacked">
            Checkpoint label
            <Input
              required
              value={label}
              maxLength={200}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Label>
          <Label layout="stacked">
            Author
            <Input
              required
              value={author}
              maxLength={100}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Label>
          <Button type="submit" disabled={!target}>
            Create checkpoint
          </Button>
        </form>
      </section>
      <section>
        <h3>Retained checkpoints</h3>
        <Label layout="stacked">
          Checkpoint
          <NativeSelect
            aria-label="Checkpoint"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setPending(null);
              setPreview("");
            }}
          >
            <option value="">Choose checkpoint</option>
            {doc.checkpoints.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} · {item.kind} · r{item.sourceRevision}
              </option>
            ))}
          </NativeSelect>
        </Label>
        {checkpoint && (
          <>
            <dl>
              <dt>Captured by</dt>
              <dd>{checkpoint.author}</dd>
              <dt>Captured at</dt>
              <dd>{new Date(checkpoint.createdAt).toLocaleString()}</dd>
              <dt>Changes on restore</dt>
              <dd>
                {diff!.addedCount} added · {diff!.changedCount} changed ·{" "}
                {diff!.removedCount} removed · {diff!.dependencyCount} changed
                dependencies
              </dd>
            </dl>
            <Button
              onClick={() =>
                void (async () => {
                  try {
                    const temp = new DesignEngine(
                      checkpointDocument(doc, checkpoint),
                    );
                    let rootId = checkpoint.payload.rootId;
                    if (checkpoint.kind === "component") {
                      rootId = uid();
                      temp.dispatch([
                        {
                          op: "component_instance",
                          id: rootId,
                          componentId: checkpoint.targetId,
                          pageId: temp.pageId,
                          parentId: null,
                          x: 0,
                          y: 0,
                          rotation: 0,
                          properties: {},
                          overrides: [],
                        },
                      ]);
                    }
                    const blob = await pngExport(
                      temp.document,
                      temp.pageId,
                      [rootId],
                      { background: "#ffffff", scale: 1 },
                    );
                    setPreview(URL.createObjectURL(blob));
                  } catch (e) {
                    onError(e instanceof Error ? e.message : String(e));
                  }
                })()
              }
            >
              Preview retained content
            </Button>
            {preview && (
              <img
                className="component-preview"
                src={preview}
                alt={`${checkpoint.label} retained preview`}
              />
            )}
            {checkpoint.kind === "frame" && (
              <Label layout="stacked">
                Restore mode
                <NativeSelect
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as typeof mode);
                    setPending(null);
                  }}
                >
                  <option value="frozen">
                    Frozen artwork · detach links and token bindings
                  </option>
                  <option value="linked">
                    Linked · use retained dependency versions
                  </option>
                </NativeSelect>
              </Label>
            )}
            {(checkpoint.kind === "component" || mode === "linked") && (
              <>
                <Checkbox
                  label="Restore changed dependencies throughout this document"
                  labelClassName="checks flex items-center gap-2 text-xs"
                  checked={dependencies}
                  onCheckedChange={(checked) => {
                    setDependencies(checked);
                    setPending(null);
                  }}
                />
                <Checkbox
                  label="Drop incompatible instance overrides"
                  labelClassName="checks flex items-center gap-2 text-xs"
                  checked={drop}
                  onCheckedChange={(checked) => {
                    setDrop(checked);
                    setPending(null);
                  }}
                />
              </>
            )}
            <div className="button-row">
              <Button
                onClick={() =>
                  attempt(() => {
                    const request: EditRequest = {
                      ...engine.guard(),
                      commands: [
                        {
                          op: "checkpoint_restore",
                          id,
                          mode,
                          restoreDependencies: dependencies,
                          conflictPolicy: drop ? "drop" : "reject",
                        },
                      ],
                    };
                    setPending({
                      request,
                      receipt: engine.edit(request, true),
                    });
                  })
                }
              >
                Review restore
              </Button>
              <Button
                onClick={() =>
                  attempt(() => {
                    engine.dispatch([{ op: "checkpoint_delete", id }]);
                    setId("");
                    setPending(null);
                  })
                }
              >
                Remove checkpoint
              </Button>
            </div>
            {pending && (
              <div className="resource-confirm" role="status">
                <strong>
                  {pending.receipt.componentImpact?.instanceCount ?? 0} linked
                  instances affected
                </strong>
                <Button
                  onClick={() =>
                    attempt(() => {
                      engine.edit(pending.request);
                      setPending(null);
                    })
                  }
                >
                  Restore as new revision
                </Button>
                <Button onClick={() => setPending(null)}>Cancel restore</Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
