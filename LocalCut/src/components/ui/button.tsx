import type { ComponentProps } from 'react';
import { Button as SharedButton } from '@localapps/ui/button';

export function Button(props: ComponentProps<typeof SharedButton>) {
  // LocalCut discloses unavailable actions only when they become usable.
  return props.disabled ? null : <SharedButton {...props} />;
}
