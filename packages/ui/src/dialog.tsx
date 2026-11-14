import type * as React from "react";
import { useContext } from "react";
import { DialogFocusContext } from "./dialog-focus";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";

import { Button } from "./button";
import { XIcon } from "lucide-react";
export { DialogFocusContext } from "./dialog-focus";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

type DialogLayout = "standard" | "compact";
const overlayStyles = {
  standard:
    "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  compact: "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs",
};
const contentStyles = {
  standard:
    "fixed top-1/2 left-1/2 z-50 grid h-auto max-h-[min(48rem,calc(var(--app-viewport-height)-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 content-start gap-6 overflow-y-auto overscroll-contain rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  compact:
    "fixed left-1/2 top-1/2 z-60 grid w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2.5rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-xl outline-none",
};
export const dialogOverlayStyles = overlayStyles.compact;
export const dialogContentStyles = contentStyles.compact;

function DialogOverlay({
  className,
  layout = "standard",
  ...props
}: DialogPrimitive.Backdrop.Props & { layout?: DialogLayout }) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(overlayStyles[layout], className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  layout = "standard",
  showCloseButton = layout === "standard",
  keepMounted = false,
  finalFocus,
  ...props
}: DialogPrimitive.Popup.Props & {
  layout?: DialogLayout;
  showCloseButton?: boolean;
  keepMounted?: boolean;
}) {
  const inheritedFocus = useContext(DialogFocusContext);
  return (
    <DialogPortal keepMounted={keepMounted}>
      <DialogOverlay layout={layout} />
      <DialogPrimitive.Popup
        finalFocus={finalFocus ?? inheritedFocus}
        data-slot="dialog-content"
        className={cn(contentStyles[layout], className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  layout = "standard",
  ...props
}: React.ComponentProps<"div"> & { layout?: DialogLayout }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        layout === "compact"
          ? "flex items-center justify-between gap-4"
          : "flex shrink-0 flex-col gap-2 border-b pb-4",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  layout = "standard",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
  layout?: DialogLayout;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        layout === "standard" && "shrink-0 border-t pt-4",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  layout = "standard",
  ...props
}: DialogPrimitive.Title.Props & { layout?: DialogLayout }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        layout === "compact"
          ? "text-lg leading-tight font-semibold"
          : "font-heading leading-none font-medium",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
