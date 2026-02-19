import { Loader2, type LucideIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";

type MetricCardProps = {
  title: string;
  description: string;
  value?: number;
  isLoading?: boolean;
  icon: LucideIcon;
};

export function MetricCard({
  title,
  description,
  value,
  isLoading,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card className="py-4">
      <CardHeader className="px-5">
        <CardTitle className="text-sm font-semibold text-foreground/90">
          {title}
        </CardTitle>
        <CardAction>
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </CardAction>
        <CardDescription className="sr-only">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        {isLoading ? (
          <div className="flex h-10 w-20 items-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="text-4xl font-semibold tracking-tight">
            {typeof value === "number" ? value : "-"}
          </div>
        )}
        <div className="mt-2 text-sm text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}
