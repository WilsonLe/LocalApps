import type * as React from "react";
import { cn } from "cn";

function Label({
  className,
  layout = "inline",
  ...props
}: React.ComponentProps<"label"> & { layout?: "inline" | "stacked" }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        layout === "stacked"
          ? "flex-col items-stretch gap-1.5"
          : "items-center gap-2",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
