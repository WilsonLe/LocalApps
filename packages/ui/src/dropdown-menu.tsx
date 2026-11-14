import { Menu } from "@base-ui/react/menu";
import { cn } from "cn";
import { menuItemStyle, menuPopupStyle } from "./menu-styles";

function DropdownMenuPopup({ className, ...props }: Menu.Popup.Props) {
  return (
    <Menu.Popup
      data-slot="dropdown-menu-content"
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

function DropdownMenuItem({ className, ...props }: Menu.Item.Props) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
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

function DropdownMenuSubmenuTrigger({
  className,
  ...props
}: Menu.SubmenuTrigger.Props) {
  return (
    <Menu.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
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

function DropdownMenuCheckboxItem({
  className,
  ...props
}: Menu.CheckboxItem.Props) {
  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={(state) =>
        cn(
          menuItemStyle,
          "pl-8",
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

function DropdownMenuRadioItem({ className, ...props }: Menu.RadioItem.Props) {
  return (
    <Menu.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={(state) =>
        cn(
          menuItemStyle,
          "pl-8",
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

export const DropdownMenu = {
  ...Menu,
  Popup: DropdownMenuPopup,
  Item: DropdownMenuItem,
  SubmenuTrigger: DropdownMenuSubmenuTrigger,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
};
