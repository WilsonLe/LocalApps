import type { ComponentProps } from "react";
import {
  DialogContent as Content,
  DialogHeader as Header,
  DialogFooter as Footer,
  DialogTitle as Title,
} from "@localapps/ui/dialog";

export { Dialog, DialogDescription } from "@localapps/ui/dialog";
export function DialogContent(props: ComponentProps<typeof Content>) {
  return <Content layout="compact" {...props} />;
}
export function DialogHeader(props: ComponentProps<typeof Header>) {
  return <Header layout="compact" {...props} />;
}
export function DialogFooter(props: ComponentProps<typeof Footer>) {
  return <Footer layout="compact" {...props} />;
}
export function DialogTitle(props: ComponentProps<typeof Title>) {
  return <Title layout="compact" {...props} />;
}
