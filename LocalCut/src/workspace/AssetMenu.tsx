import type { ReactNode, RefObject } from 'react';
import { DropdownMenu as Menu } from '@localapps/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AssetMenu({
  name,
  children,
  triggerRef,
}: {
  name: string;
  children: ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        render={
          <Button
            ref={triggerRef}
            variant="outline"
            size="icon-sm"
            className="media-actions-trigger"
            aria-label={`Actions for ${name}`}
          />
        }
      >
        <Ellipsis aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          align="end"
          sideOffset={4}
          collisionPadding={8}
          className="z-50 outline-none"
        >
          <Menu.Popup aria-label={`Actions for ${name}`} className="w-52">
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
