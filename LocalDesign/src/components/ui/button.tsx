import type { ComponentProps } from "react";
import { Button as SharedButton } from "@localapps/ui/button";

export function Button(props: ComponentProps<typeof SharedButton>) {
  // A fixed toolbar keeps disabled editor actions visible.
  return <SharedButton variant="ghost" size="sm" {...props} />;
}
