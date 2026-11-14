import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@localapps/ui/card";

export function Example({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Card className={wide ? "min-w-0 md:col-span-2" : "min-w-0"}>
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-4">
        {children}
      </CardContent>
    </Card>
  );
}
