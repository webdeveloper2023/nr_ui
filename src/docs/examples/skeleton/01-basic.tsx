import { Card, Skeleton } from "nr-ui-kit";

export default function SkeletonBasic() {
  return (
    <Card className="mx-auto w-full max-w-xs gap-3 p-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-3 w-3/5 rounded-full" />
      <Skeleton className="h-3 w-4/5 rounded-full" />
      <Skeleton className="h-3 w-2/5 rounded-full" />
    </Card>
  );
}
