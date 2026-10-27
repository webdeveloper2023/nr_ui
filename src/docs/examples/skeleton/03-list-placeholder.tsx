import { Card, Skeleton } from "nr-ui-kit";

export default function SkeletonList() {
  return (
    <Card className="mx-auto w-full max-w-md gap-1 p-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5 rounded-full" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      ))}
    </Card>
  );
}
