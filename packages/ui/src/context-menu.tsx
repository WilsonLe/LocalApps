import { ContextMenu as MenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "cn";
import { menuItemStyle, menuPopupStyle } from "./menu-styles";

function ContextMenuPopup({ className, ...props }: MenuPrimitive.Popup.Props) {
  return (
    <MenuPrimitive.Popup
      data-slot="context-menu-content"
      className={(state) =>
        cn(
          menuPopupStyle,
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

function ContextMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot="context-menu-item"
      className={(state) =>
        cn(
          menuItemStyle,
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

function ContextMenuSubmenuTrigger({
  className,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      className={(state) =>
        cn(
          menuItemStyle,
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

export const ContextMenu = {
  ...MenuPrimitive,
  Popup: ContextMenuPopup,
  Item: ContextMenuItem,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
};
