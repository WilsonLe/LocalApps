import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "cn";
import {
  DialogFooter,
  DialogHeader,
  dialogContentStyles,
  dialogOverlayStyles,
} from "./dialog";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogClose = AlertDialogPrimitive.Close;
export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground break-words", className)}
      {...props}
    />
  );
}
export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg leading-tight font-semibold", className)}
      {...props}
    />
  );
}
export function AlertDialogHeader(props: ComponentProps<typeof DialogHeader>) {
  return <DialogHeader layout="compact" {...props} />;
}
export function AlertDialogFooter(props: ComponentProps<typeof DialogFooter>) {
  return <DialogFooter layout="compact" {...props} />;
}

export function AlertDialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Popup>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop
        data-slot="alert-dialog-overlay"
        className={dialogOverlayStyles}
      />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(dialogContentStyles, className)}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
  );
}
