export const menuPopupStyle =
  "max-h-(--available-height) min-w-32 max-w-[calc(var(--app-viewport-width)-1rem)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none";

export const menuItemStyle =
  "relative flex min-h-9 cursor-default items-center gap-2 rounded-md px-3 py-2 text-sm leading-5 outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";
